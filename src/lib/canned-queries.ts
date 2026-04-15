/**
 * Canned demo queries that emulate the LifeLedger agent's tool outputs.
 * Each entry maps a user-selectable query to a fully-formed `SearchResult`.
 */

import type { ChartDataItem, Document, SearchResult } from "./api-client-types";
import { DEMO_DOCUMENTS, DEMO_SPENDING, DEMO_RECURRING, DEMO_INCOME } from "./demo-data";

const docById = (id: string): Document => DEMO_DOCUMENTS.find((d) => d.id === id)!;
const docsByIds = (ids: string[]): Document[] => ids.map(docById).filter(Boolean);

export interface CannedQuery {
  id: string;
  category: string;
  label: string;          // shown in dropdown
  query: string;          // shown as the user message
  result: Omit<SearchResult, "session_id" | "conversation_id" | "query">;
}

// ── Chart presets reused below ─────────────────────────────────────
const merchantChart: ChartDataItem = {
  type: "spending_by_merchant",
  title: "Top Merchants by Spend",
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

const allReceiptsTable: ChartDataItem = {
  type: "receipt_table",
  title: "All Receipts",
  data: DEMO_DOCUMENTS.filter((d) => d.type === "Receipt").map((d) => ({
    merchant: d.primaryEntity,
    date: d.primaryDate,
    total: parseFloat(d.totalValue.replace(/[$,]/g, "")),
    doc_id: d.id,
  })),
};

const wholeFoodsTable: ChartDataItem = {
  type: "receipt_table",
  title: "Whole Foods Receipts",
  data: DEMO_DOCUMENTS.filter((d) => d.primaryEntity === "Whole Foods Market").map((d) => ({
    merchant: d.primaryEntity,
    date: d.primaryDate,
    total: parseFloat(d.totalValue.replace(/[$,]/g, "")),
    doc_id: d.id,
  })),
};

const tripTable: ChartDataItem = {
  type: "receipt_table",
  title: "NYC Trip — Documents",
  data: [
    { merchant: "United Airlines (SFO→JFK)", date: docById("6").primaryDate, total: 418.20 },
    { merchant: "Allianz Travel Insurance", date: docById("15").primaryDate, total: 48.00 },
  ],
};

const deductionsTable: ChartDataItem = {
  type: "receipt_table",
  title: "Paycheck Deductions (last period)",
  data: [
    ...Object.entries(DEMO_INCOME.deductions.canonical),
    ...Object.entries(DEMO_INCOME.deductions.other),
  ].map(([k, v]) => ({ merchant: k, date: "Per paycheck", total: v })),
};

const incomeVsSpendingChart: ChartDataItem = {
  type: "spending_over_time",
  title: "Spending vs Monthly Take-Home",
  data: DEMO_SPENDING.by_month.map((m) => ({ month: m.month, total: m.total })),
  summary: { take_home: DEMO_INCOME.recurring_income[0].monthly_estimate },
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
        "Across all of your tracked receipts, you've spent **$2,139.43** so far. That spans **8 distinct merchants** and **11 receipts**, with the heaviest months being travel-related.",
      documents: docsByIds(["3", "5", "12", "17", "24", "25", "26", "27"]),
      chart_data: [monthlyChart],
      followUps: [
        "Where do I spend the most?",
        "Show me my spending over time",
        "How much did I spend last month?",
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
        "Your top merchants are **United Airlines ($418.20)** thanks to a recent NYC trip, then **Bay Area Dental ($240.00)** and **Costco ($214.55)**. Groceries (Whole Foods + Costco combined) account for ~$414, your single largest category.",
      documents: docsByIds(["6", "4", "24", "3", "25", "17", "27"]),
      chart_data: [merchantChart],
      followUps: [
        "Show me my Whole Foods receipts",
        "Did I take any trips recently?",
        "Break down my spending by month",
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
        "Your spending has bounced around — peaking 2 months ago at **$744.82** (mostly the NYC trip + Costco run) and dropping to **$197.60** so far this month. Average monthly spend is **~$356**.",
      documents: docsByIds(["6", "24", "3", "25", "17"]),
      chart_data: [monthlyChart],
      followUps: [
        "What drove the spike two months ago?",
        "Compare income to spending",
        "What were my biggest single purchases?",
      ],
    },
  },
  {
    id: "wholefoods-receipts",
    category: "Receipts",
    label: "Show me my Whole Foods receipts",
    query: "Show me my Whole Foods receipts",
    result: {
      answer:
        "I found **2 Whole Foods receipts** totaling **$199.49**. Most recent was this month for **$87.42** (organic produce, salmon, sourdough). The earlier visit two months ago was a larger restock at $112.07.",
      documents: docsByIds(["3", "25"]),
      chart_data: [wholeFoodsTable],
      followUps: [
        "Show all my grocery receipts",
        "How much did I spend on food this year?",
        "What healthy items did I buy?",
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
        "Here are all **9 receipts** I have on file, totaling **$835.84**. The mix is grocery, pharmacy, and food delivery.",
      documents: DEMO_DOCUMENTS.filter((d) => d.type === "Receipt"),
      chart_data: [allReceiptsTable],
      followUps: [
        "Which were food delivery?",
        "Show only grocery receipts",
        "What did I spend the most on?",
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
        "You have **3 active subscriptions** costing **$82.47/month** (~**$989.64/year**):\n\n- **Netflix** — $15.49/mo, renews in 20 days\n- **Spotify Premium** — $11.99/mo, renews in 23 days\n- **Adobe Creative Cloud** — $54.99/mo, renews in 30 days\n\nAdobe is by far your most expensive — worth checking if you still need the full suite.",
      documents: docsByIds(["19", "20", "21"]),
      chart_data: [subscriptionsTable],
      followUps: [
        "Which subscription should I cancel first?",
        "When do they all renew?",
        "How much do they cost annually?",
      ],
    },
  },
  {
    id: "trips",
    category: "Trips",
    label: "Did I take any trips recently?",
    query: "Did I take any trips recently?",
    result: {
      answer:
        "Yes — I detected **1 trip to NYC** about 2 months ago, totaling **$466.20** across 2 documents (United flight SFO→JFK and an Allianz travel insurance policy).",
      documents: docsByIds(["6", "15"]),
      chart_data: [tripTable],
      followUps: [
        "How much did I spend on the NYC trip?",
        "Do I have travel insurance?",
        "Are there any other trips coming up?",
      ],
    },
  },
  {
    id: "unhealthy",
    category: "Items",
    label: "What unhealthy items did I buy?",
    query: "What unhealthy items did I buy?",
    result: {
      answer:
        "Scanning line items across your receipts, the less-healthy purchases include:\n\n- **DoorDash · Shake Shack** — ShackBurger, cheese fries, vanilla shake ($20.77)\n- **Whole Foods** — vanilla cold brew (×2)\n- **Target** — \"Snack assortment\" ($27.51)\n\nMost of your grocery items (salmon, sourdough, strawberries) are on the healthier side.",
      documents: docsByIds(["12", "3", "17"]),
      followUps: [
        "What healthy items did I buy?",
        "Show all DoorDash orders",
        "How much did I spend on snacks?",
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
        "You have **27 documents** on file:\n\n- **9** Receipts\n- **3** Subscriptions\n- **3** Forms (insurance, medical letter)\n- **2** Payslips\n- **1** Invoice (Bay Area Dental)\n- **1** Fine (SFO parking)\n- **1** Rental Agreement\n- **7** Other (boarding pass, sticky notes, ID, photos)\n\n**2 documents** still need your review.",
      documents: DEMO_DOCUMENTS.slice(0, 8),
      followUps: [
        "What needs my review?",
        "When was my last document added?",
        "Show me only my forms",
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
        "I found **2 insurance documents** plus a related medical letter:\n\n- **Blue Shield Health** — PPO Gold plan, renews in 45 days\n- **Allianz Travel Insurance** — covers your NYC trip\n- **Dr. Patel letter of medical necessity** — referenced your Blue Shield plan",
      documents: docsByIds(["13", "15", "11"]),
      followUps: [
        "When does my health insurance renew?",
        "What does my travel insurance cover?",
        "Find anything about prescriptions",
      ],
    },
  },
  {
    id: "search-tax",
    category: "Search",
    label: "Find anything about taxes",
    query: "Find anything about taxes",
    result: {
      answer:
        "Tax-relevant documents I can see:\n\n- **2 payslips from Acme Robotics** with $812.50 federal + $287.40 state withheld per period\n- **Bay Area Dental invoice** ($240) — potentially deductible as a medical expense\n- **Dr. Patel letter of medical necessity** — supports medical deductions\n\nYour year-to-date federal withholding is approximately **$1,625**.",
      documents: docsByIds(["22", "23", "4", "11"]),
      followUps: [
        "What are my biggest deductions?",
        "Show me all my paystubs",
        "Estimate my annual tax bill",
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
        "You have **2 paystubs from Acme Robotics**, both showing **$6,250 gross / $4,612.30 net** bi-weekly. That projects to **~$9,991/month** take-home and **~$119,896 annually**. Your last paycheck was earlier this month.",
      documents: docsByIds(["22", "23"]),
      chart_data: [
        {
          type: "spending_by_merchant",
          title: "Earnings by Pay Period",
          data: DEMO_INCOME.earnings.map((e) => ({
            merchant: e.date,
            total: e.net_pay ?? 0,
            count: 1,
          })),
        },
      ],
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
        "From your latest payslip, deductions total **$2,149.73** per period. Largest are:\n\n- **Federal Tax** — $812.50\n- **Social Security** — $387.50\n- **401(k) contribution** — $312.50\n- **State Tax** — $287.40\n- **Health Insurance** — $184.20\n- **Medicare** — $90.63\n- **Commuter Benefit** — $75.00",
      documents: docsByIds(["22"]),
      chart_data: [deductionsTable],
      followUps: [
        "How much am I saving in 401(k)?",
        "Estimate my annual tax bill",
        "What's my net pay?",
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
        "Yes — by a wide margin. You earn **~$9,991/month** take-home but average **~$356/month** in tracked spending. That leaves roughly **$9,635/month** unaccounted for (likely rent, untracked bills, savings).\n\nDon't forget your **$2,450 rent** plus **$82.47/mo** in subscriptions are recurring outflows.",
      documents: docsByIds(["22", "23", "1", "19", "20", "21"]),
      chart_data: [incomeVsSpendingChart],
      followUps: [
        "What recurring costs am I paying?",
        "When is my rent due?",
        "Show me my spending trend",
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
        "**Acme Robotics** pays you **bi-weekly** (every 14 days). Average net is **$4,612.30** per check, projecting to **~$119,896 annually**. Your most recent paycheck was earlier this month.",
      documents: docsByIds(["22", "23"]),
      followUps: [
        "When's my next paycheck?",
        "What's my annual income?",
        "Compare my income to my spending",
      ],
    },
  },
  {
    id: "lease",
    category: "Lease",
    label: "When does my lease end?",
    query: "When does my lease end?",
    result: {
      answer: `Your lease at **742 Evergreen Terrace, Apt 4B** with **Greenfield Property Mgmt** ends on **${docById("1").secondaryDate}** (about 10 months out). Monthly rent is **$2,450** with a matching **$2,450 security deposit**.`,
      documents: docsByIds(["1"]),
      followUps: [
        "How much is my rent?",
        "Who's my landlord?",
        "Show me the lease agreement",
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
        "You have **6 upcoming deadlines** in the next 45 days:\n\n- **SFO parking ticket** ($78) due in 11 days\n- **Bay Area Dental invoice** ($240) due in 18 days\n- **Netflix renewal** ($15.49) in 20 days\n- **Spotify renewal** ($11.99) in 23 days\n- **Adobe CC renewal** ($54.99) in 30 days\n- **Blue Shield policy renewal** in 45 days",
      documents: docsByIds(["2", "4", "19", "20", "21", "13"]),
      followUps: [
        "Which is most urgent?",
        "How much do I owe in total?",
        "When does my lease end?",
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
        "**2 documents** need your attention — both flagged because OCR couldn't extract structured fields:\n\n- A photo of a concrete block (probably uploaded by mistake)\n- A photo of a cat (also probably uploaded by mistake)\n\nYou can mark them done from the dashboard.",
      documents: docsByIds(["7", "9"]),
      followUps: [
        "Delete the misfires",
        "Give me an overview of my documents",
        "What was my last upload?",
      ],
    },
  },
];

export const CANNED_BY_QUERY: Record<string, CannedQuery> = Object.fromEntries(
  CANNED_QUERIES.map((q) => [q.query.toLowerCase(), q])
);

// Variant answers for the "regenerate" button — cycles through these
export const REGENERATE_VARIANTS: Record<string, string[]> = {
  "total-spending": [
    "Tallying all your receipts, you're at **$2,139.43** total spend across 11 transactions and 8 merchants. Travel and groceries dominate.",
    "Total tracked spending is **$2,139.43**. Worth noting: this only counts receipts you've uploaded — recurring rent/subscriptions aren't in this number.",
  ],
  "subscriptions": [
    "Three active subscriptions — **Adobe Creative Cloud ($54.99/mo)**, **Netflix ($15.49/mo)**, and **Spotify ($11.99/mo)** — totaling **$82.47/month**. Adobe is your biggest by a 4× margin.",
  ],
};
