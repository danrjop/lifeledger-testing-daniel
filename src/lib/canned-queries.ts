/**
 * Canned demo queries — every fact below is grounded in the actual
 * documents in `demo-data.ts` (which themselves are grounded in what's
 * visible in the corresponding image file in /public/demo/).
 */

import type { ChartDataItem, Document, SearchResult } from "./api-client-types";
import { DEMO_DOCUMENTS, DEMO_SPENDING, DEMO_RECURRING, DEMO_INCOME } from "./demo-data";

const docById = (id: string): Document => DEMO_DOCUMENTS.find((d) => d.id === id)!;
const docsByIds = (ids: string[]): Document[] => ids.map(docById).filter(Boolean);

export interface CannedQuery {
  id: string;
  category: string;
  label: string;
  query: string;
  result: Omit<SearchResult, "session_id" | "conversation_id" | "query">;
}

// ── Charts derived from the seed data ──────────────────────────────
const merchantChart: ChartDataItem = {
  type: "spending_by_merchant",
  title: "Top Merchants by Spend (USD-equivalent)",
  data: DEMO_SPENDING.by_merchant.map((m) => ({
    merchant: m.merchant,
    total: m.total,
    count: m.count,
  })),
};

const monthlyChart: ChartDataItem = {
  type: "spending_over_time",
  title: "Spending Over Time",
  data: DEMO_SPENDING.by_month.map((m) => ({ month: m.month, total: m.total })),
};

const subscriptionsTable: ChartDataItem = {
  type: "receipt_table",
  title: "Active Subscriptions",
  data: DEMO_RECURRING.recurring.map((r) => ({
    merchant: r.merchant,
    date: `Renews ${r.next_renewal_date}`,
    total: r.monthly_estimate,
  })),
};

const yongfattTable: ChartDataItem = {
  type: "receipt_table",
  title: "Yongfatt Enterprise — visits",
  data: DEMO_DOCUMENTS.filter((d) => d.primaryEntity === "Yongfatt Enterprise").map((d) => ({
    merchant: d.primaryEntity,
    date: d.primaryDate,
    total: parseFloat(d.totalValue.replace(/[^0-9.]/g, "")),
    doc_id: d.id,
  })),
};

const allReceiptsTable: ChartDataItem = {
  type: "receipt_table",
  title: "All Receipts",
  data: DEMO_DOCUMENTS.filter((d) => d.type === "Receipt").map((d) => ({
    merchant: d.primaryEntity,
    date: d.primaryDate,
    total: parseFloat(d.totalValue.replace(/[^0-9.]/g, "")),
    doc_id: d.id,
  })),
};

const deductionsTable: ChartDataItem = {
  type: "receipt_table",
  title: "Per-paycheck Deductions",
  data: Object.entries(DEMO_INCOME.deductions.canonical).map(([k, v]) => ({
    merchant: k,
    date: "Per paycheck",
    total: v,
  })),
};

const earningsChart: ChartDataItem = {
  type: "spending_by_merchant",
  title: "Net Pay by Pay Period",
  data: DEMO_INCOME.earnings.map((e) => ({
    merchant: e.date ?? "—",
    total: e.net_pay ?? 0,
    count: 1,
  })),
};

// ── Canned answers ─────────────────────────────────────────────────
export const CANNED_QUERIES: CannedQuery[] = [
  {
    id: "total-spending",
    category: "Spending",
    label: "How much have I spent in total?",
    query: "How much have I spent in total?",
    result: {
      answer:
        "Across receipts, invoices, and subscription charges, your total tracked spend is **~$154.34** (USD-equivalent — Malaysian ringgit converted at ~RM 4.5/USD). The bulk is **OpenAI ChatGPT Plus** ($60 across 3 months) plus the small **Yongfatt Enterprise** and **Pasar Raya Mega Maju** purchases from the Malaysian receipts.",
      documents: docsByIds(["3", "4", "17", "19", "20", "24", "25", "26", "27", "2"]),
      chart_data: [monthlyChart],
      followUps: [
        "Where do I spend the most?",
        "Show me my Yongfatt receipts",
        "What subscriptions am I paying for?",
      ],
    },
  },
  {
    id: "spending-by-merchant",
    category: "Spending",
    label: "Where do I spend the most?",
    query: "Where do I spend the most?",
    result: {
      answer:
        "Your top merchants are **OpenAI ChatGPT Plus ($60.00)** — three monthly charges — and **Yongfatt Enterprise ($57.21 USD-eq)** across three Malaysian-receipt visits. **SFO Parking** and **Pasar Raya Mega Maju** are next, each under $20 in total.",
      documents: docsByIds(["17", "19", "20", "3", "24", "27", "2", "26", "4", "25"]),
      chart_data: [merchantChart],
      followUps: [
        "Show me my Yongfatt receipts",
        "What subscriptions am I paying for?",
        "How has my spending trended month-over-month?",
      ],
    },
  },
  {
    id: "monthly-spending",
    category: "Spending",
    label: "How has my spending trended month-over-month?",
    query: "How has my spending trended month-over-month?",
    result: {
      answer:
        "Spending has been remarkably steady — **$32–47 per month** across the last 4 months. The slight bump 2 months ago was the larger Yongfatt visit (RM 124.50). Your only recurring outflow is the **$20/mo ChatGPT Plus** subscription.",
      documents: docsByIds(["3", "24", "27", "17", "19", "20"]),
      chart_data: [monthlyChart],
      followUps: [
        "Where do I spend the most?",
        "What subscriptions am I paying for?",
        "Am I saving more than I spend?",
      ],
    },
  },
  {
    id: "yongfatt-receipts",
    category: "Receipts",
    label: "Show me my Yongfatt receipts",
    query: "Show me my Yongfatt receipts",
    result: {
      answer:
        "I found **3 Yongfatt Enterprise receipts** (Johor Bahru, Malaysia) totaling **RM 261.61** (~$57.21 USD). The original was a single \"ELEGANT SCH TR BAG 15\" for RM 80.91 on 25/12/2018; the other two are repeat visits with no itemized lines captured.",
      documents: docsByIds(["3", "24", "27"]),
      chart_data: [yongfattTable],
      followUps: [
        "What did I buy from Pasar Raya?",
        "List all my receipts",
        "Show me my OpenAI charges",
      ],
    },
  },
  {
    id: "all-receipts",
    category: "Receipts",
    label: "List all my receipts",
    query: "List all my receipts",
    result: {
      answer:
        "Here are all **7 receipts** I have on file — 3 Yongfatt visits, 2 Pasar Raya, and 2 SFO parking stops. Mixed currencies — Malaysian receipts are RM, US receipts are USD.",
      documents: DEMO_DOCUMENTS.filter((d) => d.type === "Receipt"),
      chart_data: [allReceiptsTable],
      followUps: [
        "Show me my Yongfatt receipts",
        "What was the most expensive purchase?",
        "Where do I spend the most?",
      ],
    },
  },
  {
    id: "subscriptions",
    category: "Recurring",
    label: "What subscriptions am I paying for?",
    query: "What subscriptions am I paying for?",
    result: {
      answer:
        "You have **1 active subscription**: **OpenAI ChatGPT Plus** at **$20/month** (~$240/year), paid on Visa ending **7686**. The next renewal is in 13 days. The original sign-up confirmation came in on Jan 27 2026 with a free first month, and there are 2 follow-on renewals on file.",
      documents: docsByIds(["17", "19", "20"]),
      chart_data: [subscriptionsTable],
      followUps: [
        "When does ChatGPT Plus renew next?",
        "What's the order number for my subscription?",
        "Cancel my ChatGPT Plus reminder",
      ],
    },
  },
  {
    id: "trips",
    category: "Trips",
    label: "Did I take any trips?",
    query: "Did I take any trips?",
    result: {
      answer:
        "I see one travel artifact: a **boarding pass from 2013** — passenger **Djokic Ksenija**, flight **HG285** **Belgrade (BEG) → Washington DC (DCA)** on 21 May 2013. There's no fare on the pass and no associated booking receipt, so trip spend is unknown.",
      documents: docsByIds(["6", "15"]),
      followUps: [
        "Do I have travel insurance?",
        "Show my Allianz policy",
        "What other documents are old (pre-2020)?",
      ],
    },
  },
  {
    id: "travel-insurance",
    category: "Trips",
    label: "Do I have travel insurance?",
    query: "Do I have travel insurance?",
    result: {
      answer:
        "Yes — an **Allianz Comprehensive Coverage** policy on file (underwritten by CUMIS General Insurance, Canadian). Highlights:\n\n- Trip cancellation: **up to $20,000 CAD**\n- Emergency medical: **up to $5,000,000 CAD**\n- Baggage: **$1,000 CAD**\n- Eligibility: travellers age 64 or younger, max trip length **30 days**",
      documents: docsByIds(["15"]),
      followUps: [
        "Did I take any trips?",
        "What are my insurance documents?",
        "Show my health insurance",
      ],
    },
  },
  {
    id: "doc-overview",
    category: "Library",
    label: "Give me an overview of my documents",
    query: "Give me an overview of my documents",
    result: {
      answer:
        "You have **27 documents** on file:\n\n- **7** Receipts (Yongfatt × 3, Pasar Raya × 2, SFO Parking × 2)\n- **3** Subscriptions (all ChatGPT Plus)\n- **4** Payslips (Smith and Company)\n- **4** Forms (BCBS card, Allianz policy, antibiotic packet, Chang Gung letter)\n- **1** Invoice (Pasar Raya pet food)\n- **1** Rental Agreement (Schein/Reagan template)\n- **7** Other (boarding pass, McLovin ID, sticky note, calendar note, coupons, concrete-block tag, crying-cat meme)\n\n**3** documents need your review — the concrete-block price tag, the crying-cat photo, and the blank Chang Gung letter template.",
      documents: DEMO_DOCUMENTS.slice(0, 8),
      followUps: [
        "What needs my review?",
        "Show me only my forms",
        "What's the oldest document I have?",
      ],
    },
  },
  {
    id: "search-insurance",
    category: "Search",
    label: "Find my insurance documents",
    query: "Find my insurance documents",
    result: {
      answer:
        "I found **2 insurance documents**:\n\n- **BlueCross BlueShield (PPO)** — Member ID XYZ123456789. $15 office-visit copay, $35 specialist, $75 emergency, $50 deductible.\n- **Allianz Comprehensive Coverage** — Canadian travel insurance, up to $5M CAD emergency medical.\n\nThe Anbicyn antibiotic packet and Chang Gung Memorial letter template are also medical-adjacent if you wanted to widen the search.",
      documents: docsByIds(["13", "15", "5", "11"]),
      followUps: [
        "What's my BCBS deductible?",
        "Do I have travel insurance?",
        "Find anything about prescriptions",
      ],
    },
  },
  {
    id: "search-prescriptions",
    category: "Search",
    label: "Find anything about prescriptions",
    query: "Find anything about prescriptions",
    result: {
      answer:
        "Two medical artifacts:\n\n- **Anbicyn F.C. Tablets 625 mg** — packet photo. Active ingredients: amoxicillin trihydrate + potassium clavulanate (a common antibiotic combo). No price visible on the packet.\n- **Chang Gung Memorial Hospital (Taipei)** — a **blank letter template**. The Name / Diagnosis / Date fields aren't filled in, so it doesn't actually record a prescription.\n\nIf you uploaded a real script you'd want me to extract dosing from, the Chang Gung sheet is unfortunately just a template.",
      documents: docsByIds(["5", "11"]),
      followUps: [
        "Find my insurance documents",
        "What needs my review?",
        "Give me an overview of my documents",
      ],
    },
  },
  {
    id: "earnings",
    category: "Income",
    label: "What's my income looking like?",
    query: "What's my income looking like?",
    result: {
      answer:
        "You have **4 pay stubs from Smith and Company**, paid **bi-weekly** at **$18/hr** (overtime $27/hr). The most recent stub shows **$774.00 gross** for 40 reg + 2 OT hours, with **$560.71 net** after $213.29 in deductions. Projected to **~$1,203/month** take-home or **~$14,442/year** at this cadence.",
      documents: docsByIds(["14", "21", "22", "23"]),
      chart_data: [earningsChart],
      followUps: [
        "What are my biggest deductions?",
        "Am I saving more than I spend?",
        "How often do I get paid?",
      ],
    },
  },
  {
    id: "deductions",
    category: "Income",
    label: "What are my biggest deductions?",
    query: "What are my biggest deductions?",
    result: {
      answer:
        "From your latest Smith & Co. pay stub, deductions total **$213.29** per period:\n\n- **Federal W/H** — $69.45\n- **401(k)** — $52.00\n- **FICA** — $47.99\n- **CA State W/H** — $26.45\n- **Medicare** — $11.22\n- **CA State DI** — $6.19",
      documents: docsByIds(["14"]),
      chart_data: [deductionsTable],
      followUps: [
        "What's my net pay?",
        "How much am I saving in 401(k)?",
        "What's my income looking like?",
      ],
    },
  },
  {
    id: "income-vs-spending",
    category: "Income",
    label: "Am I saving more than I spend?",
    query: "Am I saving more than I spend?",
    result: {
      answer:
        "On paper yes, by a comfortable margin. Take-home is **~$1,203/month** from Smith & Co.; tracked spending averages **~$38/month**. That implies ~$1,165/month of headroom — but note that **rent isn't in your tracked outflows yet** (your lease shows $2,450/mo, which would flip the math), and the Malaysian receipts are several years old so they don't reflect current habits.",
      documents: docsByIds(["14", "1", "17"]),
      chart_data: [monthlyChart],
      followUps: [
        "What recurring costs am I paying?",
        "When does my lease end?",
        "What's my income looking like?",
      ],
    },
  },
  {
    id: "recurring-income",
    category: "Income",
    label: "How often do I get paid?",
    query: "How often do I get paid?",
    result: {
      answer:
        "**Smith and Company** pays you **bi-weekly** as an hourly employee at **$18/hr** ($27 OT). Average net is **$555.61** per check across the 4 stubs on file, projecting to **~$14,442/year**.",
      documents: docsByIds(["14", "21", "22", "23"]),
      followUps: [
        "What are my biggest deductions?",
        "Am I saving more than I spend?",
        "What's my pay rate?",
      ],
    },
  },
  {
    id: "lease",
    category: "Lease",
    label: "Show me my lease details",
    query: "Show me my lease details",
    result: {
      answer:
        `Your lease document on file is the **Sample Rental Lease Agreement** with **Lindsay Schein (landlord)** and **Karla Reagan (tenant)**. Heads up — most fields on the template (premises address, exact term length) are blanks, so I can only confirm the parties. Monthly rent is set at **$2,450** with a term checkpoint flagged for **${docById("1").secondaryDate}**.`,
      documents: docsByIds(["1"]),
      followUps: [
        "Who's my landlord?",
        "What's my monthly rent?",
        "What deadlines are coming up?",
      ],
    },
  },
  {
    id: "deadlines",
    category: "Radar",
    label: "What deadlines are coming up?",
    query: "What deadlines are coming up?",
    result: {
      answer:
        "Three things flagged on the radar:\n\n- **ChatGPT Plus renews** in 13 days ($20)\n- **Important event** on **2026-04-24** — pulled from a Notes screenshot you uploaded that just says \"Important stuff happening\" (you may want to fill that in)\n- **Lease term checkpoint** in 305 days\n\nNo unpaid bills — your SFO parking receipts are both already paid (Visa, $8 and $12).",
      documents: docsByIds(["17", "10", "1"]),
      followUps: [
        "What's the 'Important event' note about?",
        "When does ChatGPT Plus renew next?",
        "Show me my lease details",
      ],
    },
  },
  {
    id: "needs-review",
    category: "Library",
    label: "What documents need my review?",
    query: "What documents need my review?",
    result: {
      answer:
        "**3 documents** need attention — OCR couldn't extract structured fields from any of them:\n\n- **Concrete block price tag** ($2.08, Aisle 39 Bay 9 Loc 15) — looks like an in-store photo, not a receipt.\n- **Crying-cat meme** — not a document; probably uploaded by mistake.\n- **Chang Gung Memorial letter template** — blank form, no patient info filled in.\n\nYou can mark each as Done from the dashboard, or delete them.",
      documents: docsByIds(["7", "9", "11"]),
      followUps: [
        "Give me an overview of my documents",
        "Delete the misfires",
        "Show me only my forms",
      ],
    },
  },
  {
    id: "old-id",
    category: "Library",
    label: "What's the McLovin ID about?",
    query: "What's the McLovin ID about?",
    result: {
      answer:
        "It's the **\"McLovin\" Hawaii Driver License** from the movie *Superbad* — number **01-47-87441**, DOB 06/03/1981, address 892 Momona St, Honolulu HI 96820. **Expired in June 2008** and obviously not a real ID, but I kept it filed so you can find it again.",
      documents: docsByIds(["16"]),
      followUps: [
        "Give me an overview of my documents",
        "What needs my review?",
        "What's the oldest document I have?",
      ],
    },
  },
];

export const CANNED_BY_QUERY: Record<string, CannedQuery> = Object.fromEntries(
  CANNED_QUERIES.map((q) => [q.query.toLowerCase(), q])
);

// Variant answers for the "regenerate" button
export const REGENERATE_VARIANTS: Record<string, string[]> = {
  "total-spending": [
    "Tallying every receipt, invoice, and subscription charge: **$154.34** USD-equivalent. Three of those dollars per month are recurring (ChatGPT Plus); the rest are one-off Malaysian-receipt purchases plus two SFO parking stops.",
    "Total tracked spend is **$154.34**. Worth noting: rent ($2,450/mo on the lease) isn't counted because there's no rent payment receipt on file — only the lease agreement.",
  ],
  "subscriptions": [
    "Just one: **ChatGPT Plus** at **$20/mo**. Three charges on file (Jan 27, ~Feb 27, ~Mar 27). Renews next in 13 days on Visa-7686.",
  ],
};
