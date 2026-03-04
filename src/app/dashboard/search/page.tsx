"use client";

import { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AIAnswerBox from "@/components/search/AIAnswerBox";
import ChartModal from "@/components/search/ChartModal";
import EvidenceSection from "@/components/search/EvidenceSection";
import DocumentViewer from "@/components/ui/DocumentViewer";
import { searchDocuments, regenerateAnswer, type ChatMessage, type ChartDataItem, type ApiError } from "@/lib/api-client";

function SearchResults() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const router = useRouter();

  // Conversation state
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [followUpQuery, setFollowUpQuery] = useState("");

  // Active answer phase (only applies to the latest assistant message)
  const [activePhase, setActivePhase] = useState<"thinking" | "answering" | "done">("done");

  // Regeneration
  const [regeneratingMsgId, setRegeneratingMsgId] = useState<string | null>(null);

  // Document viewer
  const [viewerDocId, setViewerDocId] = useState<string | null>(null);

  // Chart modal
  const [viewerChart, setViewerChart] = useState<ChartDataItem | null>(null);

  // Auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = useCallback(async (query: string) => {
    if (!query.trim() || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const assistantMsgId = `assistant-${Date.now()}`;

    // Add user message + loading placeholder
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: "user",
      content: query.trim(),
    };
    const loadingMsg: ChatMessage = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      isLoading: true,
    };

    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setIsLoading(true);
    setActivePhase("thinking");
    setError(null);

    try {
      const result = await searchDocuments(query.trim(), conversationId ?? undefined);

      setConversationId(result.conversation_id);

      const assistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: "assistant",
        content: result.answer,
        documents: result.documents,
        sessionId: result.session_id,
        safety: result.safety ?? null,
        groundedness: result.groundedness ?? null,
        chartData: result.chart_data ?? null,
        isLoading: false,
      };

      setMessages(prev =>
        prev.map(m => m.id === assistantMsgId ? assistantMsg : m)
      );
      setActivePhase("answering");
    } catch (err) {
      console.error("Search failed:", err);
      setMessages(prev => prev.filter(m => m.id !== assistantMsgId));
      setError("Search failed. Please try again.");
      setActivePhase("done");
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, isLoading]);

  // Handle initial query from URL
  useEffect(() => {
    if (initialQuery && messages.length === 0) {
      sendMessage(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFollowUp = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpQuery.trim()) return;
    sendMessage(followUpQuery);
    setFollowUpQuery("");
  }, [followUpQuery, sendMessage]);

  const handleRegenerate = useCallback(async (msgId: string, sessionId: number) => {
    if (regeneratingMsgId) return;
    setRegeneratingMsgId(msgId);
    try {
      const result = await regenerateAnswer(sessionId);
      setMessages(prev =>
        prev.map(m => m.id === msgId
          ? { ...m, content: result.answer, safety: result.safety ?? null, groundedness: result.groundedness ?? null, chartData: result.chart_data ?? null }
          : m
        )
      );
      setActivePhase("answering");
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.status === 429) {
        setError("Too many regenerate requests. Please wait a minute before trying again.");
        setTimeout(() => setError(null), 5000);
      } else {
        console.error("Regenerate failed:", err);
      }
    } finally {
      setRegeneratingMsgId(null);
    }
  }, [regeneratingMsgId]);

  const handleBack = useCallback(() => router.push("/dashboard"), [router]);

  // Get the last assistant message ID for typewriter targeting
  const lastAssistantId = [...messages].reverse().find(m => m.role === "assistant")?.id;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center gap-2 sm:gap-3 border-b border-bg-tertiary/50 bg-bg-primary/80 backdrop-blur-md px-3 sm:px-6 py-3">
        <button
          onClick={handleBack}
          className="flex items-center justify-center rounded-xl p-2.5 text-fg-secondary hover:bg-bg-secondary hover:text-fg-primary transition-colors duration-200 min-h-11 min-w-11"
          aria-label="Back to dashboard"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h1 className="text-base sm:text-lg font-medium text-fg-primary truncate flex-1">
          {messages.length > 0 ? messages[0].content : "Search"}
        </h1>
        <button
          onClick={handleBack}
          className="flex items-center justify-center rounded-xl p-2.5 text-fg-secondary hover:bg-bg-secondary hover:text-fg-primary transition-colors duration-200 min-h-11 min-w-11"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      {/* Scrollable message thread */}
      <main className="flex-1 overflow-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-400">
            {error}
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.role === "user" ? (
              <div className="flex justify-end">
                <div className="max-w-[90%] sm:max-w-[80%] rounded-2xl bg-accent/10 border border-accent/20 px-3 sm:px-4 py-2.5 sm:py-3">
                  <p className="text-fg-primary">{msg.content}</p>
                </div>
              </div>
            ) : (
              <div>
                <AIAnswerBox
                  phase={
                    msg.isLoading
                      ? "thinking"
                      : msg.id === lastAssistantId && activePhase !== "done"
                        ? activePhase
                        : "done"
                  }
                  answer={msg.content}
                  onDone={() => setActivePhase("done")}
                  onRegenerate={
                    msg.sessionId
                      ? () => handleRegenerate(msg.id, msg.sessionId!)
                      : undefined
                  }
                  isRegenerating={regeneratingMsgId === msg.id}
                  safety={msg.safety}
                  groundedness={msg.groundedness}
                />
                {msg.chartData && msg.chartData.length > 0 &&
                  (msg.id !== lastAssistantId || activePhase === "done") && (
                    <div className="mt-2 flex flex-col gap-1 animate-fade-in">
                      {msg.chartData.map((chart, i) => (
                        <button
                          key={`${chart.type}-${i}`}
                          onClick={() => setViewerChart(chart)}
                          className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline cursor-pointer w-fit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            {chart.type === "spending_over_time" ? (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                            ) : chart.type === "receipt_table" ? (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                            )}
                          </svg>
                          View {chart.title}
                        </button>
                      ))}
                    </div>
                )}
                {msg.documents && msg.documents.length > 0 && (
                  <EvidenceSection
                    documents={msg.documents}
                    onDocumentClick={(id) => setViewerDocId(id)}
                  />
                )}
              </div>
            )}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </main>

      {/* Follow-up input bar */}
      <div className="sticky bottom-0 border-t border-bg-tertiary/50 bg-bg-primary/80 backdrop-blur-md px-3 sm:px-6 py-2.5 sm:py-3">
        <form onSubmit={handleFollowUp} className="relative max-w-3xl mx-auto">
          <input
            type="text"
            value={followUpQuery}
            onChange={(e) => setFollowUpQuery(e.target.value)}
            placeholder="Ask a follow-up question..."
            disabled={isLoading}
            className="w-full rounded-xl bg-bg-secondary border border-bg-tertiary pl-4 pr-12 py-3 text-fg-primary placeholder:text-fg-tertiary focus:border-accent focus:ring-2 focus:ring-accent-light disabled:opacity-50 transition-colors duration-200"
          />
          <button
            type="submit"
            disabled={isLoading || !followUpQuery.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-accent hover:bg-accent/10 disabled:opacity-30 transition-colors duration-200"
            aria-label="Send"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </form>
      </div>

      {/* Document viewer modal */}
      {viewerDocId && (
        <DocumentViewer
          documentId={viewerDocId}
          onClose={() => setViewerDocId(null)}
          documents={[...new Map(messages.flatMap(m => m.documents ?? []).map(d => [d.id, d])).values()]}
          searchQuery={initialQuery}
        />
      )}

      {/* Chart modal */}
      {viewerChart && (
        <ChartModal chart={viewerChart} onClose={() => setViewerChart(null)} />
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
