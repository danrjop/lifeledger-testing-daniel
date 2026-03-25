"use client";

import { useState } from "react";
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
import type {
  SpendingAnalytics,
  RecurringAnalytics,
  TripAnalytics,
  IncomeAnalytics,
} from "@/lib/api-client";
import { formatCurrency } from "@/lib/format";

interface SpendingChartsProps {
  spending: SpendingAnalytics;
  recurring: RecurringAnalytics;
  trips: TripAnalytics;
  income?: IncomeAnalytics | null;
  onDocumentClick?: (docId: string) => void;
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-bg-tertiary/50 bg-bg-secondary p-4">
      <p className="text-xs font-medium text-fg-tertiary uppercase tracking-wider">{label}</p>
      <p className="mt-1 text-xl font-semibold text-fg-primary">{value}</p>
    </div>
  );
}

export default function SpendingCharts({ spending, recurring, trips, income, onDocumentClick }: SpendingChartsProps) {
  const avgMonthly =
    spending.by_month.length > 0
      ? spending.total / spending.by_month.length
      : 0;

  const topMerchant =
    spending.by_merchant.length > 0 ? spending.by_merchant[0].merchant : "—";

  return (
    <div className="mt-4 space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Spend" value={formatCurrency(spending.total)} />
        <StatCard label="Avg / Month" value={formatCurrency(avgMonthly)} />
        <StatCard label="Top Merchant" value={topMerchant} />
        <StatCard
          label="Recurring / mo"
          value={formatCurrency(recurring.total_monthly)}
        />
      </div>

      {/* Spending Over Time */}
      {spending.by_month.length > 0 && (
        <div className="rounded-xl border border-bg-tertiary/50 bg-bg-secondary p-5">
          <h3 className="text-sm font-semibold text-fg-secondary mb-4">
            Spending Over Time
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={spending.by_month}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
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
                fill="url(#areaGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Spending by Merchant */}
      {spending.by_merchant.length > 0 && (
        <div className="rounded-xl border border-bg-tertiary/50 bg-bg-secondary p-5">
          <h3 className="text-sm font-semibold text-fg-secondary mb-4">
            Top Merchants
          </h3>
          <ResponsiveContainer width="100%" height={Math.max(200, spending.by_merchant.length * 36)}>
            <BarChart data={spending.by_merchant} layout="vertical" margin={{ left: 10 }}>
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
      )}

      {/* Recurring Costs */}
      {recurring.recurring.length > 0 && (
        <div className="rounded-xl border border-bg-tertiary/50 bg-bg-secondary p-5">
          <h3 className="text-sm font-semibold text-fg-secondary mb-1">
            Recurring Charges
          </h3>
          <p className="text-xs text-fg-tertiary mb-4">
            {recurring.count} detected &middot; {formatCurrency(recurring.total_monthly)}/mo &middot; {formatCurrency(recurring.total_annual)}/yr
          </p>
          <div className="space-y-3">
            {recurring.recurring.map((r) => (
              <div
                key={r.merchant}
                className="flex items-center justify-between gap-3 rounded-lg border border-bg-tertiary/50 bg-bg-primary/50 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-fg-primary truncate">
                    {r.merchant}
                  </p>
                  <p className="text-xs text-fg-tertiary">
                    Every ~{r.interval_days} days &middot; {r.transaction_count} charges &middot; Next: {r.next_renewal_date}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-fg-primary">
                    {formatCurrency(r.monthly_estimate)}/mo
                  </p>
                  <p className="text-xs text-fg-tertiary">
                    {formatCurrency(r.annual_estimate)}/yr
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trip Clustering */}
      {trips.trips.length > 0 && (
        <div className="rounded-xl border border-bg-tertiary/50 bg-bg-secondary p-5">
          <h3 className="text-sm font-semibold text-fg-secondary mb-1">
            Travel Trips
          </h3>
          <p className="text-xs text-fg-tertiary mb-4">
            {trips.count} trip{trips.count !== 1 ? "s" : ""} detected &middot; {formatCurrency(trips.total_trip_spending)} total
          </p>
          <div className="space-y-3">
            {trips.trips.map((trip, i) => (
              <TripCard key={i} trip={trip} onDocumentClick={onDocumentClick} />
            ))}
          </div>
        </div>
      )}

      {/* Income / Earnings */}
      {income && income.earnings.length > 0 && (
        <div className="rounded-xl border border-bg-tertiary/50 bg-bg-secondary p-5">
          <h3 className="text-sm font-semibold text-fg-secondary mb-1">
            Earnings Overview
          </h3>
          <p className="text-xs text-fg-tertiary mb-4">
            {income.earnings.length} payslip{income.earnings.length !== 1 ? "s" : ""} &middot; {formatCurrency(income.total_gross)} gross &middot; {formatCurrency(income.total_net)} net
          </p>

          {/* Earnings over time chart */}
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={income.earnings.slice().reverse().map(e => ({
              date: e.date ?? "Unknown",
              net: e.net_pay ?? 0,
              gross: e.gross_pay ?? 0,
            }))}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-tertiary)" />
              <XAxis
                dataKey="date"
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
                formatter={(value, name) => [formatCurrency(Number(value)), name === "net" ? "Net Pay" : "Gross Pay"]}
                contentStyle={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--bg-tertiary)",
                  borderRadius: "8px",
                  color: "var(--fg-primary)",
                }}
              />
              <Area type="monotone" dataKey="gross" stroke="#6ee7b7" strokeWidth={1} fill="none" strokeDasharray="4 2" />
              <Area type="monotone" dataKey="net" stroke="#10b981" strokeWidth={2} fill="url(#incomeGrad)" />
            </AreaChart>
          </ResponsiveContainer>

          {/* Recurring income summary */}
          {income.recurring_income.length > 0 && (
            <div className="mt-4 space-y-2">
              {income.recurring_income.map((ri) => (
                <div key={ri.employer} className="flex items-center justify-between gap-3 rounded-lg border border-bg-tertiary/50 bg-bg-primary/50 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-fg-primary truncate">{ri.employer}</p>
                    <p className="text-xs text-fg-tertiary">
                      {ri.frequency} &middot; {ri.paycheck_count} paycheck{ri.paycheck_count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-emerald-500">{formatCurrency(ri.monthly_estimate)}/mo</p>
                    <p className="text-xs text-fg-tertiary">{formatCurrency(ri.annual_estimate)}/yr</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty states */}
      {spending.by_month.length === 0 && recurring.recurring.length === 0 && trips.trips.length === 0 && (!income || income.earnings.length === 0) && (
        <div className="rounded-xl border border-bg-tertiary/50 bg-bg-secondary p-8 text-center">
          <p className="text-sm text-fg-tertiary">
            No analytics data yet. Upload receipts and documents to see spending insights.
          </p>
        </div>
      )}
    </div>
  );
}

function TripCard({
  trip,
  onDocumentClick,
}: {
  trip: SpendingChartsProps["trips"]["trips"][number];
  onDocumentClick?: (docId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const startDate = new Date(trip.start_date);
  const endDate = new Date(trip.end_date);
  const sameDay = trip.start_date === trip.end_date;

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });

  return (
    <div className="rounded-lg border border-bg-tertiary/50 bg-bg-primary/50">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-fg-primary">
              {sameDay ? fmt(startDate) : `${fmt(startDate)} — ${fmt(endDate)}`}
            </p>
            {trip.location_hint && (
              <p className="text-xs text-fg-tertiary mt-0.5 truncate">{trip.location_hint}</p>
            )}
            <p className="text-xs text-fg-tertiary mt-1">
              {trip.document_count} document{trip.document_count !== 1 ? "s" : ""} &middot; tap to {expanded ? "collapse" : "view"}
            </p>
          </div>
          <p className="text-sm font-semibold text-fg-primary flex-shrink-0">
            {formatCurrency(trip.total_cost)}
          </p>
        </div>
      </button>
      {expanded && trip.documents && trip.documents.length > 0 && (
        <div className="border-t border-bg-tertiary/50 px-4 py-2 space-y-1">
          {trip.documents.map((doc) => (
            <button
              key={doc.doc_id}
              onClick={() => onDocumentClick?.(String(doc.doc_id))}
              className="w-full flex items-center justify-between gap-3 rounded px-2 py-1.5 text-left hover:bg-bg-tertiary/30 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium text-fg-primary truncate">
                  {doc.merchant || "Unknown"}
                </p>
                {doc.date && (
                  <p className="text-xs text-fg-tertiary">{doc.date}</p>
                )}
              </div>
              {doc.amount != null && (
                <p className="text-xs font-medium text-fg-primary flex-shrink-0">
                  {formatCurrency(doc.amount)}
                </p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
