import { useState } from "react";
import DocumentCard from "../ui/DocumentCard";
import { documents } from "@/data/documents";

interface BrowseViewProps {
    initialFilter?: string;
}

export default function BrowseView({ initialFilter = "All" }: BrowseViewProps) {
    const [filter, setFilter] = useState(initialFilter);

    const filteredDocs = documents.filter(doc => {
        if (filter === "All") return true;
        if (filter === "Receipts") return doc.type === "Receipt";
        if (filter === "Subscriptions") return doc.type === "Subscription";
        if (filter === "Fines") return doc.type === "Fine";
        return true;
    });

    return (
        <div className="flex h-full flex-col p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Browse Documents</h1>
                <p className="text-gray-500">Upload and manage your life admin documents.</p>
            </header>

            {/* Upload Area */}
            <section className="mb-10">
                <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-10 text-center transition-colors hover:border-blue-400 hover:bg-blue-50">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Upload new documents</h3>
                    <p className="mt-1 text-gray-500">Drag and drop files here, or click to select files</p>
                    <button className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
                        Select Files
                    </button>
                </div>
            </section>

            {/* Gallery Section */}
            <section>
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Your Documents</h2>

                    {/* Filter Toggles */}
                    <div className="flex gap-2 rounded-lg bg-gray-100 p-1">
                        {["All", "Receipts", "Subscriptions", "Fines"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${filter === f
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredDocs.map((doc) => (
                        <DocumentCard key={doc.id} {...doc} />
                    ))}
                    {filteredDocs.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-400">
                            No documents found for this filter.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
