"use client";

import { useState, useEffect, useCallback } from "react";

interface AIAnswerBoxProps {
  phase: "thinking" | "answering" | "done";
  answer: string;
  onDone: () => void;
}

export default function AIAnswerBox({ phase, answer, onDone }: AIAnswerBoxProps) {
  const [displayedText, setDisplayedText] = useState("");

  const stableOnDone = useCallback(onDone, [onDone]);

  // Typewriter effect
  useEffect(() => {
    if (phase !== "answering") return;
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
  }, [phase, answer, stableOnDone]);

  // Show full text when done
  useEffect(() => {
    if (phase === "done") {
      setDisplayedText(answer);
    }
  }, [phase, answer]);

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
            AI Answer
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

          {(phase === "answering" || phase === "done") && (
            <div className="animate-fade-in">
              <p className="text-body-lg text-fg-primary leading-relaxed">
                {displayedText}
                {phase === "answering" && (
                  <span className="inline-block w-[2px] h-[16px] bg-accent ml-0.5 align-middle animate-blink" />
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
