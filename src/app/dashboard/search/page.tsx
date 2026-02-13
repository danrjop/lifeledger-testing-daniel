"use client";

import { useState, useEffect, useMemo, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SearchHeader from "@/components/search/SearchHeader";
import AIAnswerBox from "@/components/search/AIAnswerBox";
import EvidenceSection from "@/components/search/EvidenceSection";
import DocumentViewer from "@/components/ui/DocumentViewer";
import { documents } from "@/data/documents";
import { searchDocuments, getMockAnswer } from "@/lib/search-utils";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const router = useRouter();

  const [phase, setPhase] = useState<"thinking" | "answering" | "done">("thinking");
  const [viewerDocId, setViewerDocId] = useState<string | null>(null);

  const results = useMemo(() => searchDocuments(query, documents), [query]);
  const mockAnswer = useMemo(() => getMockAnswer(query), [query]);

  // Simulate thinking → answering transition
  useEffect(() => {
    setPhase("thinking");
    const timer = setTimeout(() => setPhase("answering"), 2000);
    return () => clearTimeout(timer);
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
        <AIAnswerBox phase={phase} answer={mockAnswer} onDone={handleDone} />
        <EvidenceSection
          documents={results}
          onDocumentClick={(id) => setViewerDocId(id)}
        />
      </main>

      {viewerDocId && (
        <DocumentViewer
          documentId={viewerDocId}
          onClose={() => setViewerDocId(null)}
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
