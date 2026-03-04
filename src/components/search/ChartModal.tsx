"use client";

import type { ChartDataItem } from "@/lib/api-client";
import { ChartBlock } from "./AgentChartRenderer";

interface ChartModalProps {
  chart: ChartDataItem;
  onClose: () => void;
}

export default function ChartModal({ chart, onClose }: ChartModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors duration-200"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Chart content */}
      <div
        className="w-full max-w-3xl mx-4 max-h-[85vh] overflow-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <ChartBlock chart={chart} />
      </div>
    </div>
  );
}
