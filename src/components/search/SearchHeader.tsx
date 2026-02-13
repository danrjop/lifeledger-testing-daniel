"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchHeaderProps {
  query: string;
  onBack: () => void;
  onClear: () => void;
}

export default function SearchHeader({ query, onBack, onClear }: SearchHeaderProps) {
  const [value, setValue] = useState(query);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed && trimmed !== query) {
      router.push(`/dashboard/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-bg-tertiary/50 bg-bg-primary/80 backdrop-blur-md px-6 py-3">
      {/* Back arrow */}
      <button
        onClick={onBack}
        className="flex items-center justify-center rounded-xl p-2.5 text-fg-secondary hover:bg-bg-secondary hover:text-fg-primary transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent min-h-11 min-w-11"
        aria-label="Back to dashboard"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
      </button>

      {/* Search input */}
      <form onSubmit={handleSubmit} className="flex-1 relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-fg-tertiary pointer-events-none"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search for documents or ask questions"
          alt="Search for documents or ask questions"
          className="w-full rounded-xl bg-bg-secondary border border-bg-tertiary pl-12 pr-5 py-3 text-lg text-fg-primary placeholder:text-fg-tertiary focus:border-accent focus:ring-2 focus:ring-accent-light transition-colors duration-200"
        />
      </form>

      {/* Close button */}
      <button
        onClick={onClear}
        className="flex items-center justify-center rounded-xl p-2.5 text-fg-secondary hover:bg-bg-secondary hover:text-fg-primary transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent min-h-11 min-w-11"
        aria-label="Clear search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </header>
  );
}
