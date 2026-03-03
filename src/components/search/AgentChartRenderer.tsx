"use client";

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

interface AgentChartRendererProps {
  charts: ChartDataItem[];
}

export default function AgentChartRenderer({ charts }: AgentChartRendererProps) {
  if (!charts || charts.length === 0) return null;

  return (
    <div className="mt-4 space-y-4 animate-fade-in">
      {charts.map((chart, index) => (
        <ChartBlock key={`${chart.type}-${index}`} chart={chart} />
      ))}
    </div>
  );
}

function ChartBlock({ chart }: { chart: ChartDataItem }) {
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

function MerchantBarChart({ chart }: { chart: ChartDataItem }) {
  const data = chart.data as { merchant: string; total: number; count: number }[];

  return (
    <div className="rounded-xl border border-bg-tertiary/50 bg-bg-secondary p-5">
      <h3 className="text-sm font-semibold text-fg-secondary mb-4">
        {chart.title}
      </h3>
      <ResponsiveContainer width="100%" height={Math.max(200, data.length * 36)}>
        <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-tertiary)" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(v) => `$${v}`}
            tick={{ fill: "var(--fg-tertiary)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="merchant"
            width={120}
            tick={{ fill: "var(--fg-primary)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(Number(value)), "Total"]}
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

  return (
    <div className="rounded-xl border border-bg-tertiary/50 bg-bg-secondary p-5">
      <h3 className="text-sm font-semibold text-fg-secondary mb-4">
        {chart.title}
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="agentAreaGrad" x1="0" y1="0" x2="0" y2="1">
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
          />
          <YAxis
            tickFormatter={(v) => `$${v}`}
            tick={{ fill: "var(--fg-tertiary)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(Number(value)), "Spending"]}
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
            fill="url(#agentAreaGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function ReceiptTable({ chart }: { chart: ChartDataItem }) {
  const data = chart.data as { merchant?: string; date?: string; total?: number; doc_id?: string }[];

  return (
    <div className="rounded-xl border border-bg-tertiary/50 bg-bg-secondary p-5">
      <h3 className="text-sm font-semibold text-fg-secondary mb-4">
        {chart.title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg-tertiary/30">
              <th className="text-left px-3 py-2 font-medium text-fg-secondary">Date</th>
              <th className="text-left px-3 py-2 font-medium text-fg-secondary">Merchant</th>
              <th className="text-right px-3 py-2 font-medium text-fg-secondary">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b border-bg-tertiary/50">
                <td className="px-3 py-2 text-fg-primary">{row.date ?? "—"}</td>
                <td className="px-3 py-2 text-fg-primary">{row.merchant ?? "—"}</td>
                <td className="px-3 py-2 text-fg-primary text-right">
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
