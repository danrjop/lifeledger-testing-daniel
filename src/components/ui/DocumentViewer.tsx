import { useState, useRef, useEffect } from "react";
import { Document } from "@/lib/types";
import { getRelatedDocuments, getDocument, type RelatedDocument, type OcrBlock } from "@/lib/api-client";

interface HighlightBox {
    x: number;
    y: number;
    width: number;
    height: number;
    label?: string;
}

interface DocumentViewerProps {
    documentId: string;
    onClose: () => void;
    documents: Document[];
    highlightBoxes?: HighlightBox[];
    searchQuery?: string;  // If provided, will highlight matching OCR regions
}

// Convert 4-point polygon to percentage-based rectangle
function bboxToPercentRect(
    bbox: number[][],
    imgWidth: number,
    imgHeight: number
): { x: number; y: number; width: number; height: number } {
    const minX = Math.min(bbox[0][0], bbox[3][0]);
    const maxX = Math.max(bbox[1][0], bbox[2][0]);
    const minY = Math.min(bbox[0][1], bbox[1][1]);
    const maxY = Math.max(bbox[2][1], bbox[3][1]);
    return {
        x: (minX / imgWidth) * 100,
        y: (minY / imgHeight) * 100,
        width: ((maxX - minX) / imgWidth) * 100,
        height: ((maxY - minY) / imgHeight) * 100,
    };
}

// Filter OCR blocks that match any query term (case-insensitive)
function filterBlocksByQuery(blocks: OcrBlock[], query: string): OcrBlock[] {
    const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    if (terms.length === 0) return [];
    return blocks.filter(block => {
        const text = block.text.toLowerCase();
        return terms.some(term => text.includes(term));
    });
}

export default function DocumentViewer({ documentId, onClose, documents, highlightBoxes, searchQuery }: DocumentViewerProps) {
    const [currentDocId, setCurrentDocId] = useState(documentId);
    const [relatedDocs, setRelatedDocs] = useState<RelatedDocument[]>([]);
    const [loadingRelated, setLoadingRelated] = useState(false);

    // OCR bounding box state
    const [ocrBlocks, setOcrBlocks] = useState<OcrBlock[]>([]);
    const [imgDimensions, setImgDimensions] = useState<{ width: number; height: number } | null>(null);

    // Only show boxes if we are on the initial doc (since boxes are specific to it)
    const showBoxes = (highlightBoxes || (searchQuery && ocrBlocks.length > 0 && imgDimensions)) && currentDocId === documentId;
    const [scale, setScale] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);

    // Compute highlight boxes from search query + OCR blocks
    const computedBoxes: HighlightBox[] = (() => {
        if (highlightBoxes) return highlightBoxes;
        if (!searchQuery || !imgDimensions || ocrBlocks.length === 0) return [];
        const filtered = filterBlocksByQuery(ocrBlocks, searchQuery);
        return filtered.map(block => ({
            ...bboxToPercentRect(block.bbox, imgDimensions.width, imgDimensions.height),
            label: block.text,
        }));
    })();

    const currentIndex = documents.findIndex(d => d.id === currentDocId);
    const currentDoc = documents[currentIndex];

    // Reset zoom and image dimensions when doc changes
    useEffect(() => {
        setScale(1);
        setImgDimensions(null);
    }, [currentDocId]);

    // Fetch OCR blocks when searchQuery is provided (for initial doc only)
    useEffect(() => {
        if (!searchQuery || documentId !== currentDocId) {
            setOcrBlocks([]);
            return;
        }
        getDocument(documentId)
            .then((doc) => {
                setOcrBlocks(doc.ocr_blocks || []);
            })
            .catch((e) => {
                console.error("Failed to fetch ocr_blocks:", e);
                setOcrBlocks([]);
            });
    }, [searchQuery, documentId, currentDocId]);

    // Handle image load to get natural dimensions
    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        setImgDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };

    // Fetch related documents when currentDocId changes
    useEffect(() => {
        async function fetchRelated() {
            setLoadingRelated(true);
            try {
                const related = await getRelatedDocuments(currentDocId, 4);
                setRelatedDocs(related);
            } catch (e) {
                console.error("Failed to fetch related docs:", e);
                setRelatedDocs([]);
            } finally {
                setLoadingRelated(false);
            }
        }
        fetchRelated();
    }, [currentDocId]);

    if (!currentDoc) return null;

    const handleNext = () => {
        const nextIndex = (currentIndex + 1) % documents.length;
        setCurrentDocId(documents[nextIndex].id);
    };

    const handlePrev = () => {
        const prevIndex = (currentIndex - 1 + documents.length) % documents.length;
        setCurrentDocId(documents[prevIndex].id);
    };

    const toggleZoom = (e: React.MouseEvent) => {
        if (scale > 1) {
            setScale(1);
        } else {
            setScale(2.5); // 2.5x zoom
        }
    };

    const getTypeColor = () => {
        switch (currentDoc.type) {
            case "Receipt": return "bg-success/10 text-success";
            case "Subscription": return "bg-info/10 text-info";
            case "Fine": return "bg-danger/10 text-danger";
            default: return "bg-bg-tertiary text-fg-secondary";
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Navigation Arrows - hidden on mobile, visible on md+ */}
            <button
                onClick={handlePrev}
                className="hidden md:block absolute left-4 z-50 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
            </button>

            <button
                onClick={handleNext}
                className="hidden md:block absolute right-4 z-50 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </button>

            {/* Content Container */}
            <div className="flex flex-col md:flex-row h-full w-full max-w-7xl gap-4 md:gap-6 p-4 md:p-6 overflow-auto">

                {/* Image Area */}
                <div className="flex-1 flex items-center justify-center overflow-hidden rounded-2xl bg-black/50 relative group min-h-[40vh] md:min-h-0">
                    <div
                        ref={containerRef}
                        className={`relative cursor-zoom-in transition-transform duration-300 ease-out ${scale > 1 ? "cursor-zoom-out" : ""}`}
                        style={{ transform: `scale(${scale})` }}
                        onClick={toggleZoom}
                    >
                        <img
                            src={currentDoc.fileUrl}
                            alt={currentDoc.primaryEntity}
                            className="max-h-[85vh] max-w-full object-contain shadow-2xl"
                            onLoad={handleImageLoad}
                        />
                        {/* Overlay Boxes */}
                        {showBoxes && computedBoxes.map((box, idx) => (
                            <div
                                key={idx}
                                className="absolute border-2 border-accent bg-accent/20 z-10"
                                style={{
                                    top: `${box.y}%`,
                                    left: `${box.x}%`,
                                    width: `${box.width}%`,
                                    height: `${box.height}%`
                                }}
                            >
                                {box.label && (
                                    <span className="absolute -top-8 left-0 bg-accent text-accent-fg text-lg px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                                        {box.label}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-xs pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to Zoom
                    </div>
                </div>

                {/* Side Panel (Info) */}
                <div className="w-full md:w-96 flex-shrink-0 flex flex-col gap-4 md:gap-6 rounded-2xl bg-bg-secondary border border-bg-tertiary/50 p-4 md:p-6 overflow-y-auto max-h-[50vh] md:max-h-none">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <div className={`text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${getTypeColor()}`}>
                                {currentDoc.type}
                            </div>
                            <span className="text-sm text-fg-tertiary">{currentDoc.primaryDate}</span>
                        </div>
                        <h2 className="text-display font-semibold text-fg-primary tracking-heading">{currentDoc.primaryEntity}</h2>
                        {currentDoc.secondaryEntity && (
                            <p className="text-body-lg text-fg-secondary font-medium">{currentDoc.secondaryEntity}</p>
                        )}
                        <div className="mt-4 text-display-lg font-semibold text-fg-primary tracking-heading tabular-nums">{currentDoc.totalValue}</div>
                    </div>

                    <div className="h-px bg-bg-tertiary"></div>

                    {/* Meta Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <span className="text-xs text-fg-tertiary uppercase tracking-wide">Status</span>
                            <span className="font-medium text-fg-primary">{currentDoc.status}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-fg-tertiary uppercase tracking-wide">Type</span>
                            <span className="font-medium text-fg-primary">{currentDoc.type}</span>
                        </div>
                    </div>

                    {currentDoc.metadata && (
                        <div className="flex flex-col gap-2">
                            <h3 className="text-xs font-bold text-fg-tertiary uppercase tracking-wider">Details</h3>
                            {Object.entries(currentDoc.metadata).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-sm py-1 border-b border-bg-tertiary/50 last:border-0">
                                    <span className="text-fg-secondary">{key}</span>
                                    <span className="font-medium text-fg-primary">{value}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {currentDoc.lineItems && (
                        <div className="flex flex-col gap-3">
                            <h3 className="text-xs font-bold text-fg-tertiary uppercase tracking-wider">Items</h3>
                            <ul className="text-sm space-y-2">
                                {currentDoc.lineItems.map((item, idx) => (
                                    <li key={idx} className="flex justify-between items-start">
                                        <div className="flex gap-2">
                                            <span className="text-fg-tertiary font-medium w-4">{item.qty}x</span>
                                            <span className="text-fg-secondary line-clamp-2">{item.description}</span>
                                        </div>
                                        <span className="font-medium text-fg-primary tabular-nums">{item.amount}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Related Documents */}
                    {(loadingRelated || relatedDocs.length > 0) && (
                        <>
                            <div className="h-px bg-bg-tertiary"></div>
                            <div className="flex flex-col gap-3">
                                <h3 className="text-xs font-bold text-fg-tertiary uppercase tracking-wider">
                                    Related Documents
                                </h3>
                                {loadingRelated ? (
                                    <div className="text-sm text-fg-tertiary">Loading...</div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {relatedDocs.map((doc) => (
                                            <button
                                                key={doc.id}
                                                onClick={() => setCurrentDocId(doc.id)}
                                                className="flex items-center gap-3 p-2 rounded-lg bg-bg-primary hover:bg-bg-tertiary/50 transition-colors text-left"
                                            >
                                                <img
                                                    src={doc.fileUrl}
                                                    alt=""
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-fg-primary truncate">
                                                        {doc.primaryEntity}
                                                    </p>
                                                    <p className="text-xs text-fg-tertiary">
                                                        {doc.similarity}% match · {doc.type}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
