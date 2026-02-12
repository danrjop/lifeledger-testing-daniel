"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FeatureShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!phoneRef.current) return;

      gsap.from(phoneRef.current, {
        y: 200,
        opacity: 0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          end: "center 55%",
          scrub: 1.2,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-28">
      <div className="overflow-hidden rounded-3xl bg-[#1E1D18] px-10 py-20 md:px-20 md:py-28">
        <div className="mx-auto flex max-w-7xl flex-col gap-16 lg:flex-row lg:items-center lg:gap-20">
          {/* Left — text content */}
          <div className="flex-1 space-y-12">
            <h2
              className="font-serif leading-[1.1] tracking-heading text-[#EDECE4]"
              style={{
                fontSize: "clamp(2.75rem, 2rem + 3vw, 4.5rem)",
              }}
            >
              Save on stress,
              <br />
              Take back control of your&nbsp;time&nbsp;and&nbsp;money
            </h2>

            <div className="flex flex-col gap-5">
              <FeatureCard
                title="Track free trials"
                description="Remember free trials and avoid unnecessary charges"
              />
              <FeatureCard
                title="Spending clarity"
                description="Make your spending habits visible and searchable"
              />
            </div>
          </div>

          {/* Right — phone with scroll-driven entrance */}
          <div
            ref={phoneRef}
            className="flex shrink-0 justify-center lg:justify-end"
          >
            <img
              src="/misc_images/phonesvg.avif"
              alt="LifeLedger app on phone"
              className="pointer-events-none h-[min(720px,70vh)] w-auto select-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Feature card ──────────────────────────────────────────── */

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#3A3930]/50 bg-[#2A2921]">
      <div className="h-1 w-full bg-gradient-to-r from-accent to-accent-hover" />
      <div className="p-7">
        <h3
          className="mb-3 font-serif tracking-heading text-[#EDECE4]"
          style={{ fontSize: "clamp(1.5rem, 1.2rem + 1vw, 2.25rem)" }}
        >
          {title}
        </h3>
        <p
          className="leading-relaxed text-[#A8A79F]"
          style={{
            fontSize: "clamp(1.15rem, 1rem + 0.5vw, 1.4rem)",
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
