"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { CANNED_QUERIES } from "@/lib/canned-queries";

interface Props {
  placeholder?: string;
  onSelect: (query: string) => void;
  size?: "lg" | "md";
  disabled?: boolean;
  openDirection?: "down" | "up";
}

const PANEL_MAX_H = 448; // px — matches max-h-[28rem]
const GAP = 8;            // px gap between button and panel

export default function CannedQueryDropdown({
  placeholder = "Try an example question…",
  onSelect,
  size = "lg",
  disabled,
  openDirection = "down",
}: Props) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ left: number; top: number; width: number } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Recompute panel position whenever it opens / on resize / on scroll.
  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const update = () => {
      const rect = btnRef.current!.getBoundingClientRect();
      const panelH = panelRef.current?.offsetHeight ?? PANEL_MAX_H;
      const top =
        openDirection === "up"
          ? Math.max(8, rect.top - panelH - GAP)
          : rect.bottom + GAP;
      setCoords({ left: rect.left, top, width: rect.width });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, openDirection]);

  // Close on outside click.
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        wrapRef.current &&
        !wrapRef.current.contains(target) &&
        panelRef.current &&
        !panelRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const grouped = CANNED_QUERIES.reduce<Record<string, typeof CANNED_QUERIES>>(
    (acc, q) => {
      (acc[q.category] ||= []).push(q);
      return acc;
    },
    {}
  );

  const sizeCls = size === "lg" ? "py-3 text-lg pl-12 pr-10" : "py-2 text-base pl-10 pr-8";

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`w-full text-left rounded-xl bg-bg-secondary border border-bg-tertiary text-fg-primary hover:border-accent focus:border-accent focus:ring-2 focus:ring-accent-light transition-colors duration-200 disabled:opacity-50 ${sizeCls}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`absolute ${size === "lg" ? "left-4 w-5 h-5" : "left-3 w-4 h-4"} top-1/2 -translate-y-1/2 text-fg-tertiary pointer-events-none`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <span className="text-fg-tertiary">{placeholder}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`absolute ${size === "lg" ? "right-3 w-4 h-4" : "right-2 w-3 h-3"} top-1/2 -translate-y-1/2 text-fg-tertiary transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && coords && typeof document !== "undefined" &&
        createPortal(
          <div
            ref={panelRef}
            style={{
              position: "fixed",
              left: coords.left,
              top: coords.top,
              width: coords.width,
              maxHeight: PANEL_MAX_H,
              zIndex: 1000,
            }}
            className="overflow-y-auto rounded-xl bg-bg-primary border border-bg-tertiary shadow-2xl animate-fade-in"
          >
            {Object.entries(grouped).map(([category, queries]) => (
              <div key={category}>
                <div className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-fg-tertiary">
                  {category}
                </div>
                {queries.map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onSelect(q.query);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-fg-primary hover:bg-bg-secondary transition-colors"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
