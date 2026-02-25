"use client";

import { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { SafetyInfo, GroundednessInfo } from "@/lib/api-client";

interface AIAnswerBoxProps {
  phase: "thinking" | "answering" | "done";
  answer: string;
  onDone: () => void;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  safety?: SafetyInfo | null;
  groundedness?: GroundednessInfo | null;
}

const STRATEGY_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  REFUSE_ONLY:        { bg: "bg-danger/10", border: "border-danger/20", text: "text-danger" },
  REFUSE_REDIRECT:    { bg: "bg-warning/10", border: "border-warning/20", text: "text-warning" },
  DEESCALATE_SUPPORT: { bg: "bg-info/10", border: "border-info/20", text: "text-info" },
  ASK_CLARIFY_SAFE:   { bg: "bg-warning/10", border: "border-warning/20", text: "text-warning" },
};

function SafetyBanner({ safety }: { safety: SafetyInfo }) {
  const styles = STRATEGY_STYLES[safety.strategy] ?? STRATEGY_STYLES.REFUSE_ONLY;

  return (
    <div className={`rounded-xl ${styles.bg} ${styles.border} border p-4 ${styles.text} animate-fade-in`}>
      <p className="text-sm font-medium whitespace-pre-line">{safety.message}</p>
      {safety.detail && (
        <p className="text-sm mt-2 opacity-80">{safety.detail}</p>
      )}
    </div>
  );
}

function GroundednessBanner({ groundedness }: { groundedness: GroundednessInfo }) {
  return (
    <div className="mt-4 rounded-xl bg-info/10 border border-info/20 p-4 text-info animate-fade-in">
      <p className="text-sm">{groundedness.message}</p>
    </div>
  );
}

export default function AIAnswerBox({ phase, answer, onDone, onRegenerate, isRegenerating, safety, groundedness }: AIAnswerBoxProps) {
  const [displayedText, setDisplayedText] = useState("");
  const isSafetyBlock = !!safety;

  const stableOnDone = useCallback(onDone, [onDone]);

  // Skip typewriter and signal done immediately for safety blocks
  useEffect(() => {
    if (isSafetyBlock && phase === "answering") {
      stableOnDone();
    }
  }, [isSafetyBlock, phase, stableOnDone]);

  // Typewriter effect — only for normal answers
  useEffect(() => {
    if (isSafetyBlock || phase !== "answering") return;
    let i = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      i++;
      setDisplayedText(answer.slice(0, i));
      if (i >= answer.length) {
        clearInterval(interval);
        stableOnDone();
      }
    }, 5);
    return () => clearInterval(interval);
  }, [phase, answer, stableOnDone, isSafetyBlock]);

  // Show full text when done
  useEffect(() => {
    if (phase === "done" && !isSafetyBlock) {
      setDisplayedText(answer);
    }
  }, [phase, answer, isSafetyBlock]);

  return (
    <section className="mb-8">
      <div className="rounded-2xl border border-bg-tertiary/50 bg-bg-secondary p-6">
        {/* Section label */}
        <div className="flex items-center gap-2 mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 text-fg-tertiary"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z"
            />
          </svg>
          <h2 className="text-xs font-bold text-fg-tertiary uppercase tracking-wider">
            Response
          </h2>
        </div>

        {/* Answer content area */}
        <div className="min-h-[60px]">
          {phase === "thinking" && (
            <div className="flex items-center gap-2 px-4 py-2 animate-fade-in">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-fg-tertiary animate-thinking-dot-1" />
                <span className="w-1.5 h-1.5 rounded-full bg-fg-tertiary animate-thinking-dot-2" />
                <span className="w-1.5 h-1.5 rounded-full bg-fg-tertiary animate-thinking-dot-3" />
              </div>
              <span className="text-sm font-sans text-fg-tertiary italic">
                LifeLedger is thinking
              </span>
            </div>
          )}

          {phase !== "thinking" && isSafetyBlock && (
            <SafetyBanner safety={safety} />
          )}

          {phase !== "thinking" && !isSafetyBlock && (
            <>
              <div className="animate-fade-in">
                <div className="text-body-lg text-fg-primary leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="mb-2">{children}</p>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      ul: ({ children }) => <ul className="list-disc pl-5 mb-2">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-5 mb-2">{children}</ol>,
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      h3: ({ children }) => <h3 className="font-semibold mt-3 mb-1">{children}</h3>,
                      code: ({ children }) => <code className="bg-bg-tertiary px-1.5 py-0.5 rounded text-sm">{children}</code>,
                      table: ({ children }) => <div className="overflow-x-auto mb-2"><table className="w-full border-collapse text-sm">{children}</table></div>,
                      thead: ({ children }) => <thead className="bg-bg-tertiary">{children}</thead>,
                      th: ({ children }) => <th className="text-left font-semibold px-3 py-2 border-b border-bg-tertiary">{children}</th>,
                      td: ({ children }) => <td className="px-3 py-2 border-b border-bg-tertiary/50">{children}</td>,
                    }}
                  >
                    {displayedText}
                  </ReactMarkdown>
                  {phase === "answering" && (
                    <span className="inline-block w-[2px] h-[16px] bg-accent ml-0.5 align-middle animate-blink" />
                  )}
                </div>
                {phase === "done" && onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    disabled={isRegenerating}
                    className="mt-3 flex items-center gap-1.5 text-xs text-fg-tertiary hover:text-fg-secondary transition-colors disabled:opacity-50"
                  >
                    {isRegenerating ? (
                      <>
                        <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                        </svg>
                        Regenerate
                      </>
                    )}
                  </button>
                )}
              </div>
              {phase === "done" && groundedness && (
                <GroundednessBanner groundedness={groundedness} />
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
