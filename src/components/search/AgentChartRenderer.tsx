"use client";

import { useId } from "react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { ChartDataItem } from "@/lib/api-client";
import { formatCurrency } from "@/lib/format";

export function ChartBlock({ chart }: { chart: ChartDataItem }) {
  switch (chart.type) {
    case "spending_by_merchant":
      return <MerchantBarChart chart={chart} />;
    case "spending_over_time":
      return <SpendingAreaChart chart={chart} />;
    case "receipt_table":
      return <ReceiptTable chart={chart} />;
    default:
      return null;
  }
}

/* ── helpers for wrapping Y-axis merchant labels ── */

const CHAR_WIDTH = 6.5; // approximate px per char at fontSize 12
const MAX_LABEL_PX = 150;
const MAX_CHARS_PER_LINE = Math.floor(MAX_LABEL_PX / CHAR_WIDTH);
const LINE_HEIGHT = 14;

/** Split text into wrapped lines that fit within MAX_CHARS_PER_LINE. */
function wrapText(text: string): string[] {
  if (text.length <= MAX_CHARS_PER_LINE) return [text];
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > MAX_CHARS_PER_LINE && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/** Count how many wrapped lines the longest merchant name needs. */
function maxLineCount(data: { merchant: string }[]): number {
  let max = 1;
  for (const d of data) {
    max = Math.max(max, wrapText(d.merchant).length);
  }
  return max;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function WrappedYAxisTick(props: any) {
  const { x, y, payload } = props;
  const lines = wrapText(payload.value);
  const startY = y - ((lines.length - 1) * LINE_HEIGHT) / 2;
  return (
    <text x={x} textAnchor="end" fill="var(--fg-primary)" fontSize={12}>
      {lines.map((line, i) => (
        <tspan x={x - 4} dy={i === 0 ? startY - y : LINE_HEIGHT} key={i}>
          {line}
        </tspan>
      ))}
    </text>
  );
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/* ── Chart components ── */

function MerchantBarChart({ chart }: { chart: ChartDataItem }) {
  const data = chart.data as { merchant: string; total: number; count: number }[];

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-bg-tertiary/50 bg-bg-secondary p-5">
        <h3 className="text-sm font-semibold text-fg-secondary mb-4">
          {chart.title}
        </h3>
        <p className="text-sm text-fg-tertiary text-center py-8">No data available</p>
      </div>
    );
  }

  const rowHeight = Math.max(36, maxLineCount(data) * LINE_HEIGHT + 16);

  return (
    <div className="rounded-xl border border-bg-tertiary/50 bg-bg-secondary p-5">
      <h3 className="text-sm font-semibold text-fg-secondary mb-4">
        {chart.title}
      </h3>
      <ResponsiveContainer width="100%" height={Math.max(200, data.length * rowHeight)}>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-tertiary)" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(v: number) => formatCurrency(v)}
            tick={{ fill: "var(--fg-tertiary)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            type="category"
            dataKey="merchant"
            width={MAX_LABEL_PX}
            tick={<WrappedYAxisTick />}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(Number(value)), "Total"]}
            contentStyle={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--bg-tertiary)",
              borderRadius: "8px",
              color: "var(--fg-primary)",
            }}
          />
          <Bar dataKey="total" fill="var(--accent)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function SpendingAreaChart({ chart }: { chart: ChartDataItem }) {
  const data = chart.data as { month: string; total: number }[];
  const gradientId = useId();

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-bg-tertiary/50 bg-bg-secondary p-5">
        <h3 className="text-sm font-semibold text-fg-secondary mb-4">
          {chart.title}
        </h3>
        <p className="text-sm text-fg-tertiary text-center py-8">No data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-bg-tertiary/50 bg-bg-secondary p-5">
      <h3 className="text-sm font-semibold text-fg-secondary mb-4">
        {chart.title}
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-tertiary)" />
          <XAxis
            dataKey="month"
            tick={{ fill: "var(--fg-tertiary)", fontSize: 12 }}
            axisLine={{ stroke: "var(--bg-tertiary)" }}
            tickLine={false}
            interval="preserveStartEnd"
            angle={data.length > 8 ? -35 : 0}
            textAnchor={data.length > 8 ? "end" : "middle"}
            height={data.length > 8 ? 50 : 30}
          />
          <YAxis
            tickFormatter={(v: number) => formatCurrency(v)}
            tick={{ fill: "var(--fg-tertiary)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={70}
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(Number(value)), "Spending"]}
            contentStyle={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--bg-tertiary)",
              borderRadius: "8px",
              color: "var(--fg-primary)",
            }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="var(--accent)"
            strokeWidth={2}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function ReceiptTable({ chart }: { chart: ChartDataItem }) {
  const data = chart.data as { merchant?: string; date?: string; total?: number; doc_id?: string }[];

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-bg-tertiary/50 bg-bg-secondary p-5">
        <h3 className="text-sm font-semibold text-fg-secondary mb-4">
          {chart.title}
        </h3>
        <p className="text-sm text-fg-tertiary text-center py-8">No data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-bg-tertiary/50 bg-bg-secondary p-5">
      <h3 className="text-sm font-semibold text-fg-secondary mb-4">
        {chart.title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg-tertiary/30">
              <th className="text-left px-3 py-2 font-medium text-fg-secondary whitespace-nowrap">Date</th>
              <th className="text-left px-3 py-2 font-medium text-fg-secondary">Merchant</th>
              <th className="text-right px-3 py-2 font-medium text-fg-secondary whitespace-nowrap">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b border-bg-tertiary/50">
                <td className="px-3 py-2 text-fg-primary whitespace-nowrap">{row.date ?? "—"}</td>
                <td className="px-3 py-2 text-fg-primary max-w-[200px] break-words">{row.merchant ?? "—"}</td>
                <td className="px-3 py-2 text-fg-primary text-right whitespace-nowrap">
                  {row.total != null ? formatCurrency(row.total) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
