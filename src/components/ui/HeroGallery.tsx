"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

interface CardData {
  src: string;
  alt: string;
  question: string;
  answer: string;
}

const cards: CardData[] = [
  {
    src: "/misc_images/adobe.png",
    alt: "Adobe subscription billing",
    question: "When was I billed for my Adobe subscription?",
    answer: "You were billed on 04/08/2021.",
  },
  {
    src: "/misc_images/microsoft.png",
    alt: "Azure consumption",
    question: "What was my consumption for Azure this month?",
    answer: "You have used 2220 units this month.",
  },
  {
    src: "/misc_images/tax.png",
    alt: "Tax return document",
    question: "Find my 2016 tax return.",
    answer: "Here is your 2016 tax return.",
  },
  {
    src: "/misc_images/ticket.jpg",
    alt: "Parking ticket",
    question: "Why did I get a ticket last month?",
    answer: "Vehicle was parked without paying the due amount.",
  },
  {
    src: "/misc_images/walmart.jpg",
    alt: "Walmart grocery receipt",
    question: "How much did I spend on groceries last month?",
    answer: "You spent $35.05 on groceries last month.",
  },
];

const GAP = 20;
const REPEAT_COUNT = 7;
const loopedCards = Array.from({ length: REPEAT_COUNT }, () => cards).flat();
const MIDDLE_START = cards.length * 3;

export default function HeroGallery() {
  const trackRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(MIDDLE_START);

  const [cardWidth, setCardWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [animPhase, setAnimPhase] = useState<
    "idle" | "typing-question" | "thinking" | "typing-answer"
  >("idle");
  const [displayedText, setDisplayedText] = useState("");

  // Compute card width so exactly 5 fit: 2 partial edges + 3 full
  useEffect(() => {
    const compute = () => setCardWidth((window.innerWidth - 4 * GAP) / 5);
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  // Main animation loop — all logic lives here to avoid stale closures
  useEffect(() => {
    if (cardWidth === 0) return;

    const track = trackRef.current;
    if (!track) return;

    let alive = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const tweens: gsap.core.Tween[] = [];

    const cardTotal = cardWidth + GAP;

    const getX = (idx: number) =>
      window.innerWidth / 2 - idx * cardTotal - cardWidth / 2;

    const schedule = (fn: () => void, ms: number) => {
      const t = setTimeout(() => {
        if (alive) fn();
      }, ms);
      timers.push(t);
    };

    const animate = (
      target: gsap.TweenTarget,
      vars: gsap.TweenVars
    ): gsap.core.Tween => {
      const t = gsap.to(target, vars);
      tweens.push(t);
      return t;
    };

    const typeTextLocal = (
      text: string,
      speed: number,
      onComplete: () => void
    ) => {
      let i = 0;
      setDisplayedText("");
      const interval = setInterval(() => {
        if (!alive) {
          clearInterval(interval);
          return;
        }
        i++;
        setDisplayedText(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          onComplete();
        }
      }, speed);
      timers.push(interval as unknown as ReturnType<typeof setTimeout>);
    };

    // Run chat sequence on centered card, then call onDone
    const runChat = (idx: number, onDone: () => void) => {
      if (!alive) return;
      const card = loopedCards[idx];

      setActiveIndex(idx);
      setAnimPhase("typing-question");
      setDisplayedText("");

      // Bouncy scale up on the whole card
      const cardEl = track.querySelectorAll("[data-gallery-card]")[idx];
      if (cardEl) {
        animate(cardEl, { scale: 1.08, duration: 0.4, ease: "back.out(2.5)" });
      }

      typeTextLocal(card.question, 45, () => {
        schedule(() => {
          setAnimPhase("thinking");
          setDisplayedText("LifeLedger is thinking");

          schedule(() => {
            setAnimPhase("typing-answer");
            setDisplayedText("");

            typeTextLocal(card.answer, 45, () => {
              schedule(() => {
                // Bouncy scale down
                if (cardEl) {
                  animate(cardEl, {
                    scale: 1,
                    duration: 0.35,
                    ease: "back.out(1.6)",
                  });
                }
                setActiveIndex(null);
                setAnimPhase("idle");
                setDisplayedText("");
                onDone();
              }, 1800);
            });
          }, 1500);
        }, 400);
      });
    };

    // Advance to next card, then run its chat sequence
    const advance = () => {
      if (!alive) return;

      // Loop wrap: if near end, snap back to middle silently
      if (indexRef.current >= cards.length * (REPEAT_COUNT - 2)) {
        indexRef.current -= cards.length * 2;
        gsap.set(track, { x: getX(indexRef.current) });
      }

      indexRef.current++;
      const targetX = getX(indexRef.current);

      // Scroll to next card with ease-out (fast start, slow finish)
      animate(track, {
        x: targetX,
        duration: 1.1,
        ease: "power3.out",
        onComplete: () => {
          if (!alive) return;
          runChat(indexRef.current, () => {
            schedule(advance, 600);
          });
        },
      });
    };

    // Initialize: position on starting card, run its chat, then begin loop
    gsap.set(track, { x: getX(indexRef.current) });

    schedule(() => {
      runChat(indexRef.current, () => {
        schedule(advance, 600);
      });
    }, 700);

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
      tweens.forEach((t) => t.kill());
      setActiveIndex(null);
      setAnimPhase("idle");
    };
  }, [cardWidth]);

  if (cardWidth === 0) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[340px]">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-40 z-20 bg-gradient-to-r from-[var(--bg-primary)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-40 z-20 bg-gradient-to-l from-[var(--bg-primary)] to-transparent" />

      <div
        ref={trackRef}
        className="flex items-end h-full will-change-transform"
        style={{ gap: `${GAP}px` }}
      >
        {loopedCards.map((card, i) => {
          const isActive = activeIndex === i;
          return (
            <div
              key={`card-${i}`}
              data-gallery-card
              className="relative flex-shrink-0 pb-6"
              style={{ width: `${cardWidth}px` }}
            >
              {/* Chat overlay */}
              {isActive && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-30 flex flex-col items-center gap-2 animate-fade-in"
                  style={{ width: "min(90vw, 360px)" }}>
                  {animPhase === "typing-question" && (
                    <div className="bg-white/95 dark:bg-[#2E2D26]/95 backdrop-blur-sm rounded-2xl px-5 py-2.5 shadow-lg border border-black/5 dark:border-white/10 max-w-full flex items-start gap-2.5">
                      <svg className="w-[18px] h-[18px] flex-shrink-0 text-fg-tertiary mt-[3px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <p className="text-base font-sans text-fg-primary text-center flex-1">
                        {displayedText}
                        <span className="inline-block w-[2px] h-[16px] bg-fg-primary ml-0.5 align-middle animate-blink" />
                      </p>
                    </div>
                  )}

                  {animPhase === "thinking" && (
                    <div className="flex items-center gap-2 px-4 py-2 animate-fade-in">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-fg-tertiary animate-thinking-dot-1" />
                        <span className="w-1.5 h-1.5 rounded-full bg-fg-tertiary animate-thinking-dot-2" />
                        <span className="w-1.5 h-1.5 rounded-full bg-fg-tertiary animate-thinking-dot-3" />
                      </div>
                      <span className="text-sm font-sans text-fg-tertiary italic">
                        {displayedText}
                      </span>
                    </div>
                  )}

                  {animPhase === "typing-answer" && (
                    <div className="px-4 py-2 animate-fade-in">
                      <p className="text-base font-sans text-fg-primary font-medium text-center">
                        {displayedText}
                        <span className="inline-block w-[2px] h-[16px] bg-accent ml-0.5 align-middle animate-blink" />
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Image card with border */}
              <div
                className={`rounded-2xl overflow-hidden shadow-md border-[3px] transition-colors duration-300 ${
                  isActive
                    ? "border-accent/60 shadow-xl"
                    : "border-[var(--bg-tertiary)] opacity-75"
                }`}
              >
                <Image
                  src={card.src}
                  alt={card.alt}
                  width={750}
                  height={450}
                  className="w-full h-auto object-cover"
                  priority={i < 10}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
