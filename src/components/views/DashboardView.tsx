import { useState } from "react";
import EventCard from "../ui/EventCard";
import DocumentCard from "../ui/DocumentCard";
import { documents } from "@/data/documents";

interface DashboardViewProps {
    onViewDoc: (id: string) => void;
}

export default function DashboardView({ onViewDoc }: DashboardViewProps) {
    const [selectedDocId, setSelectedDocId] = useState(documents[0]?.id);

    const selectedDoc = documents.find(d => d.id === selectedDocId) || documents[0];

    const events = [
        { date: "2026-02-05", title: "Return deadline (Hardware)", docRef: "doc_receipt_1" },
        // Wait, documents are: receipt1 (Zheng Hui), receipt2 (McDonalds), receipt3 (Sam Sam), receipt4 (Asia Mart), receipt5 (Lightroom)
        // Subscription: adobe (doc_sub_adobe), azure (doc_sub_azure)
        // Fine: ticket (doc_ticket_rome)
        // Let's make the events match the data
        { date: "2026-02-12", title: "Adobe renewal", docRef: "doc_sub_adobe" },
        { date: "2026-02-15", title: "Azure auto-pay", docRef: "doc_sub_azure" },
        { date: "2026-02-20", title: "Ticket dispute due", docRef: "doc_ticket_rome" },
    ].filter(evt => documents.some(d => d.id === evt.docRef)); // Only showing events with valid docs

    return (
        <div className="flex h-full flex-col gap-8 overflow-y-auto p-8">
            {/* Events Radar Section */}
            <section>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Events Radar</h2>
                    <span className="text-xs text-gray-400">Click an event → full screen view</span>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {events.map((evt, idx) => (
                        <div key={idx} onClick={() => onViewDoc(evt.docRef)} className="cursor-pointer transition-transform hover:scale-105 active:scale-95">
                            <EventCard {...evt} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Documents Layout - Main List + Detail Placeholder */}
            <section className="flex flex-1 gap-6 min-h-0">
                {/* Document List (Left) */}
                <div className="w-1/3 flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-gray-900">Documents</h2>
                    <div className="flex flex-col gap-3 h-full overflow-y-auto pr-2">
                        {documents.map((doc) => (
                            <div key={doc.id} onClick={() => setSelectedDocId(doc.id)} className={selectedDocId === doc.id ? "ring-2 ring-blue-500 rounded-xl" : ""}>
                                <DocumentCard {...doc} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detail View (Right) */}
                <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6 shadow-sm overflow-y-auto">
                    {selectedDoc && (
                        <>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{selectedDoc.primaryEntity}</h2>
                                    <p className="text-gray-500">{selectedDoc.type} • {selectedDoc.totalValue} • {selectedDoc.primaryDate}</p>
                                </div>
                                <span className={`rounded-md px-3 py-1 text-xs font-medium ${selectedDoc.type === "Receipt" ? "bg-green-100 text-green-700" :
                                    selectedDoc.type === "Subscription" ? "bg-purple-100 text-purple-700" :
                                        "bg-red-100 text-red-700"
                                    }`}>
                                    {selectedDoc.type}
                                </span>
                            </div>

                            {/* Extracted Data Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                                    <div className="text-xs text-gray-500 mb-1">Entity</div>
                                    <div className="font-semibold text-gray-900">{selectedDoc.primaryEntity}</div>
                                    {selectedDoc.secondaryEntity && <div className="text-xs text-gray-400 mt-1">{selectedDoc.secondaryEntity}</div>}
                                </div>
                                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                                    <div className="text-xs text-gray-500 mb-1">Amount</div>
                                    <div className="font-semibold text-gray-900">{selectedDoc.totalValue}</div>
                                </div>
                                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                                    <div className="text-xs text-gray-500 mb-1">Date</div>
                                    <div className="font-semibold text-gray-900">{selectedDoc.primaryDate}</div>
                                </div>
                                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                                    <div className="text-xs text-gray-500 mb-1">Status</div>
                                    <div className="font-semibold text-gray-900">{selectedDoc.status}</div>
                                </div>
                            </div>

                            {/* Line Items if available */}
                            {selectedDoc.lineItems && (
                                <div className="mb-8">
                                    <h3 className="text-sm font-bold text-gray-900 mb-3">Line Items</h3>
                                    <div className="rounded-lg border border-gray-200 overflow-hidden text-sm">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50 text-gray-500">
                                                <tr>
                                                    <th className="px-4 py-2 font-medium">Description</th>
                                                    <th className="px-4 py-2 font-medium text-right">Qty</th>
                                                    <th className="px-4 py-2 font-medium text-right">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {selectedDoc.lineItems.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td className="px-4 py-2">{item.description}</td>
                                                        <td className="px-4 py-2 text-right">{item.qty || 1}</td>
                                                        <td className="px-4 py-2 text-right">{item.amount}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Metadata Key-Value Pairs */}
                            {selectedDoc.metadata && (
                                <div className="mb-8">
                                    <h3 className="text-sm font-bold text-gray-900 mb-3">Metadata</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(selectedDoc.metadata).map(([key, value]) => (
                                            <div key={key} className="flex gap-2 rounded-md border border-gray-200 px-3 py-1.5 text-xs">
                                                <span className="font-medium text-gray-500">{key}:</span>
                                                <span className="text-gray-900">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Evidence Placeholder */}
                            <div className="w-full h-64 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden relative cursor-zoom-in group" onClick={() => onViewDoc(selectedDoc.id)}>
                                <img src={selectedDoc.fileUrl} alt="Evidence" className="w-full h-full object-contain" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
                                    <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                                        Click to Enlarge
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
