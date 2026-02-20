"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SearchHeader from "@/components/search/SearchHeader";
import AIAnswerBox from "@/components/search/AIAnswerBox";
import EvidenceSection from "@/components/search/EvidenceSection";
import DocumentViewer from "@/components/ui/DocumentViewer";
import { searchDocuments, type Document } from "@/lib/api-client";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const router = useRouter();

  const [phase, setPhase] = useState<"thinking" | "answering" | "done">("thinking");
  const [viewerDocId, setViewerDocId] = useState<string | null>(null);
  const [results, setResults] = useState<Document[]>([]);
  const [answer, setAnswer] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Fetch search results from API
  useEffect(() => {
    if (!query) {
      setResults([]);
      setAnswer("");
      return;
    }

    setPhase("thinking");
    setError(null);

    searchDocuments(query)
      .then((result) => {
        setResults(result.documents);
        setAnswer(result.answer);
        setPhase("answering");
      })
      .catch((err) => {
        console.error("Search failed:", err);
        setError("Search failed. Please try again.");
        setPhase("done");
      });
  }, [query]);

  const handleDone = useCallback(() => setPhase("done"), []);
  const handleBack = useCallback(() => router.push("/dashboard"), [router]);

  return (
    <div className="flex h-full flex-col">
      <SearchHeader
        query={query}
        onBack={handleBack}
        onClear={handleBack}
      />

      <main className="flex-1 overflow-auto p-8">
        {error ? (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-400">
            {error}
          </div>
        ) : (
          <>
            <AIAnswerBox phase={phase} answer={answer} onDone={handleDone} />
            <EvidenceSection
              documents={results}
              onDocumentClick={(id) => setViewerDocId(id)}
            />
          </>
        )}
      </main>

      {viewerDocId && (
        <DocumentViewer
          documentId={viewerDocId}
          onClose={() => setViewerDocId(null)}
          documents={results}
          searchQuery={query}
        />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-fg-tertiary animate-thinking-dot-1" />
              <span className="w-1.5 h-1.5 rounded-full bg-fg-tertiary animate-thinking-dot-2" />
              <span className="w-1.5 h-1.5 rounded-full bg-fg-tertiary animate-thinking-dot-3" />
            </div>
            <span className="text-sm font-sans text-fg-tertiary italic">Loading...</span>
          </div>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
