import { useState, useRef, useEffect } from "react";
import { Document } from "@/data/documents";
import { documents } from "@/data/documents";

interface DocumentViewerProps {
    documentId: string;
    onClose: () => void;
    highlightBoxes?: { x: number; y: number; width: number; height: number; label?: string }[];
}

export default function DocumentViewer({ documentId, onClose, highlightBoxes }: DocumentViewerProps) {
    const [currentDocId, setCurrentDocId] = useState(documentId);
    // ...

    // Only show boxes if we are on the initial doc (since boxes are specific to it)
    const showBoxes = highlightBoxes && currentDocId === documentId;
    const [scale, setScale] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);

    const currentIndex = documents.findIndex(d => d.id === currentDocId);
    const currentDoc = documents[currentIndex];

    // Reset zoom when doc changes
    useEffect(() => {
        setScale(1);
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

            {/* Navigation Arrows */}
            <button
                onClick={handlePrev}
                className="absolute left-4 z-50 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
            </button>

            <button
                onClick={handleNext}
                className="absolute right-4 z-50 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </button>

            {/* Content Container */}
            <div className="flex h-full w-full max-w-7xl gap-6 p-6">

                {/* Image Area */}
                <div className="flex-1 flex items-center justify-center overflow-hidden rounded-2xl bg-black/50 relative group">
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
                        />
                        {/* Overlay Boxes */}
                        {showBoxes && highlightBoxes.map((box, idx) => (
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
                <div className="w-96 flex flex-col gap-6 rounded-2xl bg-bg-secondary border border-bg-tertiary/50 p-6 overflow-y-auto">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <div className={`text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${getTypeColor()}`}>
                                {currentDoc.type}
                            </div>
                            <span className="text-sm text-fg-tertiary">{currentDoc.primaryDate}</span>
                        </div>
                        <h2 className="text-2xl font-semibold text-fg-primary leading-tight tracking-tight">{currentDoc.primaryEntity}</h2>
                        {currentDoc.secondaryEntity && (
                            <p className="text-fg-secondary font-medium">{currentDoc.secondaryEntity}</p>
                        )}
                        <div className="mt-4 text-3xl font-semibold text-fg-primary tabular-nums">{currentDoc.totalValue}</div>
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
                </div>
            </div>
        </div>
    );
}
