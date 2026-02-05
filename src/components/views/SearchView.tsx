import { useState, useEffect } from "react";
import DocumentCard from "../ui/DocumentCard";
import { documents } from "@/data/documents";
import { Document } from "@/data/documents";

interface SearchViewProps {
    query: string;
    onBack: () => void;
    onViewDoc: (id: string, bboxes?: BoundingBox[]) => void;
}

interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
    label?: string;
}

export default function SearchView({ query, onBack, onViewDoc }: SearchViewProps) {
    const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

    // Mock logic to determine the "answer", "candidates", and "evidence" (bboxes)
    const getMockResponse = () => {
        let answer = "";
        let candidateIds: string[] = [];
        let bboxes: Record<string, BoundingBox[]> = {};

        if (query.includes("food")) {
            answer = "You have spent a total of **$32.20** on food in the new year. This includes purchases at McDonald's ($26.60 (incl. tax)) and some snacks at Asia Mart.";
            candidateIds = ["doc_receipt_2", "doc_receipt_4"];
            bboxes = {
                // SROIE X51006619772 (McDonalds)
                "doc_receipt_2": [
                    { x: 65, y: 88, width: 25, height: 4, label: "Total" },
                    { x: 10, y: 15, width: 70, height: 5, label: "Merchant" }
                ],
                // SROIE X51005268472 (Asia Mart)
                "doc_receipt_4": [
                    { x: 60, y: 85, width: 25, height: 4, label: "Total" }
                ]
            };
        } else if (query.includes("home supplies")) {
            answer = "You have spent **$126.55** on home supplies. This includes a hardware purchase at Zheng Hui ($112.45) and office supplies at Sam Sam Trading ($14.10).";
            candidateIds = ["doc_receipt_1", "doc_receipt_3"];
            bboxes = {
                "doc_receipt_1": [{ x: 55, y: 92, width: 20, height: 4, label: "Total" }],
                "doc_receipt_3": [{ x: 45, y: 88, width: 25, height: 5, label: "Total" }]
            };
        } else if (query.includes("subscriptions")) {
            answer = "Your upcoming subscriptions are:\n- **Microsoft Azure** (approx $45.32) renewing in 5 days.\n- **Adobe Creative Cloud** ($19.99) renewing in 20 days.";
            candidateIds = ["doc_sub_azure", "doc_sub_adobe"];
            bboxes = {
                "doc_sub_azure": [
                    { x: 10, y: 32, width: 40, height: 5, label: "Next Payment" },
                    { x: 60, y: 32, width: 20, height: 5, label: "Amount" }
                ],
                "doc_sub_adobe": [
                    { x: 15, y: 42, width: 35, height: 4, label: "Renewal Date" }
                ]
            };
        } else if (query.includes("fine")) {
            answer = "Your speeding fine from Comune di Roma for **€105.00** was issued approximately 2 weeks ago. If the 5-day reduced payment window has passed, verify the due date on the notice.";
            candidateIds = ["doc_ticket_rome"];
            bboxes = {
                "doc_ticket_rome": [
                    { x: 68, y: 24, width: 25, height: 4, label: "Date" },
                    { x: 60, y: 65, width: 15, height: 4, label: "Amount" },
                    { x: 15, y: 45, width: 50, height: 6, label: "Infraction" }
                ]
            };
        } else {
            answer = "I'm sorry, I couldn't find a specific answer for that in your documents.";
            candidateIds = [];
        }

        return { answer, candidateIds, bboxes };
    };

    const { answer, candidateIds, bboxes } = getMockResponse();
    const candidates = documents.filter(doc => candidateIds.includes(doc.id));

    // Auto-select first candidate if none selected
    useEffect(() => {
        if (candidates.length > 0 && !selectedDocId) {
            setSelectedDocId(candidates[0].id);
        }
    }, [candidates, selectedDocId]);

    const selectedDoc = documents.find(d => d.id === selectedDocId);
    const activeBBoxes = selectedDocId ? bboxes[selectedDocId] || [] : [];

    return (
        <div className="flex h-full flex-col overflow-hidden">
            {/* Header / Query */}
            <div className="p-6 pb-2 shrink-0">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-medium text-gray-900">"{query}"</h1>
                </div>

                {/* Answer Box */}
                <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
                    {/* Removed "AI Overview" Header as requested */}
                    <div className="prose prose-sm text-gray-800">
                        <div className="flex gap-3">
                            <div className="shrink-0 mt-1 h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                                ✨
                            </div>
                            <p className="whitespace-pre-line leading-relaxed text-lg m-0">{answer}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Split Content */}
            <div className="flex flex-1 gap-6 p-6 min-h-0 pt-2">

                {/* Left: Candidates List */}
                <div className="w-1/3 flex flex-col gap-4 overflow-hidden">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide shrink-0">Evidence Sources</h2>
                    <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2 pb-4">
                        {candidates.map((doc) => (
                            <div
                                key={doc.id}
                                onClick={() => setSelectedDocId(doc.id)}
                                className={`cursor - pointer transition - all ${selectedDocId === doc.id
                                    ? "ring-2 ring-blue-500 rounded-xl shadow-md scale-[1.02]"
                                    : "opacity-80 hover:opacity-100"
                                    } `}
                            >
                                <DocumentCard {...doc} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Detail / Evidence View */}
                <div className="flex-1 flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden h-full">
                    {selectedDoc ? (
                        <div className="flex flex-col h-full">
                            {/* Image Container with BBoxes */}
                            <div className="shrink-0 bg-gray-100 p-6 flex items-center justify-center border-b border-gray-200" style={{ height: '500px' }}>
                                <div className="relative h-full w-full flex items-center justify-center">
                                    {/* Wrapper to ensure bboxes align with natural image size */}
                                    <div className="relative h-auto w-auto max-h-full max-w-full inline-block shadow-lg">
                                        <img
                                            src={selectedDoc.fileUrl}
                                            alt="Evidence"
                                            className="block max-h-full max-w-full object-contain cursor-zoom-in"
                                            style={{ maxHeight: '452px' }} // Height of parent (500) - padding (48) approx
                                            onClick={() => onViewDoc(selectedDoc.id, activeBBoxes)}
                                        />
                                        {/* Bounding Boxes Overlay */}
                                        {activeBBoxes.map((box, idx) => (
                                            <div
                                                key={idx}
                                                className="absolute border-2 border-blue-500 bg-blue-500/20 z-10 pointer-events-none"
                                                style={{
                                                    top: `${box.y}%`,
                                                    left: `${box.x}%`,
                                                    width: `${box.width}%`,
                                                    height: `${box.height}%`
                                                }}
                                            >
                                                {box.label && (
                                                    <span className="absolute -top-6 left-0 bg-blue-600 text-white text-xs px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                                                        {box.label}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Metadata / Details Panel (Scrollable) */}
                            <div className="flex-1 bg-white p-6 overflow-y-auto">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{selectedDoc.primaryEntity}</h2>
                                        <p className="text-gray-500">{selectedDoc.type} • {selectedDoc.totalValue} • {selectedDoc.primaryDate}</p>
                                    </div>
                                    <button
                                        onClick={() => onViewDoc(selectedDoc.id, activeBBoxes)}
                                        className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1"
                                    >
                                        Full Details
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0-5.25 5.25M21 3v5.25" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                                        <div className="text-xs text-gray-500 mb-1">Entity</div>
                                        <div className="font-semibold text-gray-900">{selectedDoc.primaryEntity}</div>
                                    </div>
                                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                                        <div className="text-xs text-gray-500 mb-1">Amount</div>
                                        <div className="font-semibold text-gray-900">{selectedDoc.totalValue}</div>
                                    </div>
                                    {selectedDoc.lineItems && (
                                        <div className="col-span-2 rounded-lg border border-gray-100 bg-gray-50 p-3">
                                            <div className="text-xs text-gray-500 mb-2">Relevant Items</div>
                                            <div className="space-y-1">
                                                {selectedDoc.lineItems.slice(0, 3).map((item, idx) => (
                                                    <div key={idx} className="flex justify-between text-sm">
                                                        <span className="text-gray-700 truncate">{item.description}</span>
                                                        <span className="font-medium">{item.amount}</span>
                                                    </div>
                                                ))}
                                                {selectedDoc.lineItems.length > 3 && (
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        + {selectedDoc.lineItems.length - 3} more items...
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">
                            Select a document to view evidence
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
