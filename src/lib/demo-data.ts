/**
 * Frontend-only demo seed data.
 * No backend calls — everything below is hand-authored to mimic the LifeLedger
 * agent's output for the canned demo queries.
 */

import type {
  Document,
  RadarEvent,
  SpendingAnalytics,
  RecurringAnalytics,
  TripAnalytics,
  IncomeAnalytics,
  DocumentDetail,
  RelatedDocument,
  OcrBlock,
} from "./api-client-types";

// (Type-only imports above; no runtime dep on api-client.)

const DEMO = "/demo";

// Helper to make a fake OCR block
function block(text: string, x: number, y: number, w: number, h: number, conf = 0.95): OcrBlock {
  return {
    text,
    confidence: conf,
    bbox: [
      [x, y],
      [x + w, y],
      [x + w, y + h],
      [x, y + h],
    ],
  };
}

// Date helpers — anchored relative to "today" for radar realism
const today = new Date();
function daysFromNow(n: number): string {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}
function monthsAgo(n: number, day = 15): string {
  const d = new Date(today);
  d.setMonth(d.getMonth() - n);
  d.setDate(day);
  return d.toISOString().split("T")[0];
}

export const DEMO_DOCUMENTS: Document[] = [
  // ── Rental Agreement ────────────────────────────────────────────
  {
    id: "1",
    type: "Rental Agreement",
    fileUrl: `${DEMO}/SAMPLE-Simple-1-Page-Lease-Agreement-790x1024.webp`,
    status: "Done",
    primaryEntity: "Greenfield Property Mgmt",
    secondaryEntity: "742 Evergreen Terrace, Apt 4B",
    primaryDate: monthsAgo(2, 1),
    secondaryDate: daysFromNow(305),
    totalValue: "$2,450.00",
    metadata: {
      "Monthly Rent": "$2,450.00",
      "Security Deposit": "$2,450.00",
      "Lease Start": monthsAgo(2, 1),
      "Lease End": daysFromNow(305),
      Landlord: "Greenfield Property Mgmt",
    },
    radarProcessed: true,
  },
  // ── Fine ─────────────────────────────────────────────────────────
  {
    id: "2",
    type: "Fine",
    fileUrl: `${DEMO}/SFO_Parking_Ticket.jpg`,
    status: "Done",
    primaryEntity: "SFO Parking Authority",
    secondaryEntity: "Citation #SFO-228491",
    primaryDate: monthsAgo(0, today.getDate() - 4),
    secondaryDate: daysFromNow(11),
    totalValue: "$78.00",
    metadata: {
      Violation: "Expired meter",
      "Due Date": daysFromNow(11),
      "Citation #": "SFO-228491",
    },
    radarProcessed: true,
  },
  // ── Receipts (varied merchants & dates for charts) ───────────────
  {
    id: "3",
    type: "Receipt",
    fileUrl: `${DEMO}/X_upload_test.jpg`,
    status: "Done",
    primaryEntity: "Whole Foods Market",
    primaryDate: monthsAgo(0, 8),
    totalValue: "$87.42",
    lineItems: [
      { description: "Organic strawberries", qty: "2", unitPrice: "$5.99", amount: "$11.98" },
      { description: "Sourdough loaf", qty: "1", unitPrice: "$6.49", amount: "$6.49" },
      { description: "Cold brew coffee", qty: "2", unitPrice: "$4.99", amount: "$9.98" },
      { description: "Atlantic salmon (1 lb)", qty: "1", unitPrice: "$18.99", amount: "$18.99" },
      { description: "Misc grocery", qty: "—", unitPrice: "—", amount: "$39.98" },
    ],
    radarProcessed: true,
  },
  {
    id: "4",
    type: "Invoice",
    fileUrl: `${DEMO}/X_upload_test2.jpg`,
    status: "Done",
    primaryEntity: "Bay Area Dental",
    secondaryEntity: "Patient: Sally R.",
    primaryDate: monthsAgo(1, 12),
    secondaryDate: daysFromNow(18),
    totalValue: "$240.00",
    metadata: {
      "Service": "Cleaning + X-ray",
      "Due Date": daysFromNow(18),
    },
    radarProcessed: true,
  },
  {
    id: "5",
    type: "Receipt",
    fileUrl: `${DEMO}/antibiotic.JPG`,
    status: "Done",
    primaryEntity: "Walgreens Pharmacy",
    primaryDate: monthsAgo(1, 22),
    totalValue: "$24.18",
    lineItems: [
      { description: "Amoxicillin 500mg (30 ct)", qty: "1", unitPrice: "$24.18", amount: "$24.18" },
    ],
    radarProcessed: true,
  },
  {
    id: "6",
    type: "Other",
    fileUrl: `${DEMO}/boardingpass.jpg`,
    status: "Done",
    primaryEntity: "United Airlines",
    secondaryEntity: "SFO → JFK · Flight UA 514",
    primaryDate: monthsAgo(2, 4),
    totalValue: "$418.20",
    metadata: {
      Seat: "14C",
      "Confirmation #": "X7K2QP",
    },
    radarProcessed: true,
  },
  {
    id: "7",
    type: "Other",
    fileUrl: `${DEMO}/concreteblocktest.JPG`,
    status: "Needs Review",
    primaryEntity: "Unrecognized image",
    primaryDate: monthsAgo(0, today.getDate() - 1),
    totalValue: "—",
    radarProcessed: true,
  },
  {
    id: "8",
    type: "Other",
    fileUrl: `${DEMO}/coupons1.jpeg`,
    status: "Done",
    primaryEntity: "Bed Bath & Beyond Coupons",
    primaryDate: monthsAgo(0, today.getDate() - 7),
    totalValue: "—",
    radarProcessed: true,
  },
  {
    id: "9",
    type: "Other",
    fileUrl: `${DEMO}/crycat.png`,
    status: "Needs Review",
    primaryEntity: "Photo (no document detected)",
    primaryDate: monthsAgo(0, today.getDate() - 2),
    totalValue: "—",
    radarProcessed: true,
  },
  {
    id: "10",
    type: "Other",
    fileUrl: `${DEMO}/datetestpic.PNG`,
    status: "Done",
    primaryEntity: "Calendar screenshot",
    primaryDate: monthsAgo(0, today.getDate() - 3),
    totalValue: "—",
    radarProcessed: true,
  },
  {
    id: "11",
    type: "Form",
    fileUrl: `${DEMO}/doctor_letter.jpg`,
    status: "Done",
    primaryEntity: "Dr. Patel — Sunset Medical",
    secondaryEntity: "Letter of Medical Necessity",
    primaryDate: monthsAgo(2, 19),
    totalValue: "—",
    radarProcessed: true,
  },
  {
    id: "12",
    type: "Receipt",
    fileUrl: `${DEMO}/doordashapp.png`,
    status: "Done",
    primaryEntity: "DoorDash",
    secondaryEntity: "Shake Shack",
    primaryDate: monthsAgo(0, today.getDate() - 5),
    totalValue: "$32.18",
    lineItems: [
      { description: "ShackBurger", qty: "1", unitPrice: "$8.99", amount: "$8.99" },
      { description: "Cheese fries", qty: "1", unitPrice: "$5.49", amount: "$5.49" },
      { description: "Vanilla shake", qty: "1", unitPrice: "$6.29", amount: "$6.29" },
      { description: "Delivery + tip", amount: "$11.41" },
    ],
    radarProcessed: true,
  },
  {
    id: "13",
    type: "Form",
    fileUrl: `${DEMO}/healthinsurance.png`,
    status: "Done",
    primaryEntity: "Blue Shield Health",
    secondaryEntity: "Member: Sally R. — PPO Gold",
    primaryDate: monthsAgo(4, 1),
    secondaryDate: daysFromNow(45),
    totalValue: "—",
    metadata: {
      "Plan": "PPO Gold",
      "Renewal": daysFromNow(45),
    },
    radarProcessed: true,
  },
  {
    id: "14",
    type: "Other",
    fileUrl: `${DEMO}/images.png`,
    status: "Done",
    primaryEntity: "Sticky note — meeting prep",
    primaryDate: monthsAgo(0, today.getDate() - 6),
    totalValue: "—",
    radarProcessed: true,
  },
  {
    id: "15",
    type: "Form",
    fileUrl: `${DEMO}/insurancepolicytravel.png`,
    status: "Done",
    primaryEntity: "Allianz Travel Insurance",
    secondaryEntity: "Trip: NYC, May 2026",
    primaryDate: monthsAgo(2, 4),
    totalValue: "$48.00",
    metadata: {
      Coverage: "Trip cancellation + medical",
      "Policy #": "ALZ-119284",
    },
    radarProcessed: true,
  },
  {
    id: "16",
    type: "Other",
    fileUrl: `${DEMO}/mclovinid.jpg`,
    status: "Done",
    primaryEntity: "ID card scan",
    primaryDate: monthsAgo(3, 8),
    totalValue: "—",
    radarProcessed: true,
  },
  {
    id: "17",
    type: "Receipt",
    fileUrl: `${DEMO}/test6.jpg`,
    status: "Done",
    primaryEntity: "Target",
    primaryDate: monthsAgo(1, 5),
    totalValue: "$54.99",
    lineItems: [
      { description: "Tide laundry detergent", qty: "1", unitPrice: "$14.99", amount: "$14.99" },
      { description: "Paper towels (6-pack)", qty: "1", unitPrice: "$12.49", amount: "$12.49" },
      { description: "Snack assortment", qty: "—", unitPrice: "—", amount: "$27.51" },
    ],
    radarProcessed: true,
  },
  {
    id: "18",
    type: "Other",
    fileUrl: `${DEMO}/teststickynote.JPG`,
    status: "Done",
    primaryEntity: "Sticky note — grocery list",
    primaryDate: monthsAgo(0, today.getDate() - 8),
    totalValue: "—",
    radarProcessed: true,
  },

  // ── Synthetic extras (reuse images) for richer financial insights
  {
    id: "19",
    type: "Subscription",
    fileUrl: `${DEMO}/doordashapp.png`,
    status: "Done",
    primaryEntity: "Netflix",
    primaryDate: monthsAgo(0, 4),
    secondaryDate: daysFromNow(20),
    totalValue: "$15.49",
    metadata: { "Renews": daysFromNow(20), Frequency: "Monthly" },
    radarProcessed: true,
  },
  {
    id: "20",
    type: "Subscription",
    fileUrl: `${DEMO}/doordashapp.png`,
    status: "Done",
    primaryEntity: "Spotify Premium",
    primaryDate: monthsAgo(0, 7),
    secondaryDate: daysFromNow(23),
    totalValue: "$11.99",
    metadata: { "Renews": daysFromNow(23), Frequency: "Monthly" },
    radarProcessed: true,
  },
  {
    id: "21",
    type: "Subscription",
    fileUrl: `${DEMO}/doordashapp.png`,
    status: "Done",
    primaryEntity: "Adobe Creative Cloud",
    primaryDate: monthsAgo(0, 14),
    secondaryDate: daysFromNow(30),
    totalValue: "$54.99",
    metadata: { "Renews": daysFromNow(30), Frequency: "Monthly" },
    radarProcessed: true,
  },
  {
    id: "22",
    type: "Payslip",
    fileUrl: `${DEMO}/X_upload_test2.jpg`,
    status: "Done",
    primaryEntity: "Acme Robotics, Inc.",
    secondaryEntity: "Pay period ending " + monthsAgo(0, 1),
    primaryDate: monthsAgo(0, 1),
    totalValue: "$4,612.30",
    metadata: { "Gross Pay": "$6,250.00", "Net Pay": "$4,612.30", "Pay Frequency": "Bi-weekly" },
    radarProcessed: true,
  },
  {
    id: "23",
    type: "Payslip",
    fileUrl: `${DEMO}/X_upload_test2.jpg`,
    status: "Done",
    primaryEntity: "Acme Robotics, Inc.",
    secondaryEntity: "Pay period ending " + monthsAgo(1, 15),
    primaryDate: monthsAgo(1, 15),
    totalValue: "$4,612.30",
    metadata: { "Gross Pay": "$6,250.00", "Net Pay": "$4,612.30" },
    radarProcessed: true,
  },
  {
    id: "24",
    type: "Receipt",
    fileUrl: `${DEMO}/test6.jpg`,
    status: "Done",
    primaryEntity: "Costco Wholesale",
    primaryDate: monthsAgo(2, 9),
    totalValue: "$214.55",
    lineItems: [
      { description: "Bulk paper goods", amount: "$48.99" },
      { description: "Rotisserie chicken (2)", amount: "$10.98" },
      { description: "Misc groceries", amount: "$154.58" },
    ],
    radarProcessed: true,
  },
  {
    id: "25",
    type: "Receipt",
    fileUrl: `${DEMO}/X_upload_test.jpg`,
    status: "Done",
    primaryEntity: "Whole Foods Market",
    primaryDate: monthsAgo(2, 22),
    totalValue: "$112.07",
    radarProcessed: true,
  },
  {
    id: "26",
    type: "Receipt",
    fileUrl: `${DEMO}/doordashapp.png`,
    status: "Done",
    primaryEntity: "DoorDash",
    secondaryEntity: "Sweetgreen",
    primaryDate: monthsAgo(1, 27),
    totalValue: "$19.85",
    radarProcessed: true,
  },
  {
    id: "27",
    type: "Receipt",
    fileUrl: `${DEMO}/test6.jpg`,
    status: "Done",
    primaryEntity: "Target",
    primaryDate: monthsAgo(3, 11),
    totalValue: "$78.30",
    radarProcessed: true,
  },
];

// ── Document detail (OCR overlay text for the viewer) ───────────────
const DETAIL_OVERRIDES: Record<string, Partial<DocumentDetail>> = {
  "1": {
    doc_text: "RESIDENTIAL LEASE AGREEMENT — 742 Evergreen Terrace, Apt 4B. Monthly rent $2,450. Security deposit $2,450. Lease term 12 months.",
    ocr_blocks: [
      block("LEASE AGREEMENT", 250, 60, 290, 30),
      block("Greenfield Property Mgmt", 80, 130, 320, 22),
      block("Monthly Rent: $2,450", 80, 360, 240, 22),
      block("Security Deposit: $2,450", 80, 400, 280, 22),
    ],
  },
  "2": {
    doc_text: "SAN FRANCISCO PARKING CITATION SFO-228491. Violation: Expired meter. Amount due $78.00.",
    ocr_blocks: [
      block("PARKING CITATION", 100, 80, 280, 28),
      block("Citation # SFO-228491", 100, 130, 260, 20),
      block("Amount Due: $78.00", 100, 380, 220, 22),
    ],
  },
  "3": {
    doc_text: "WHOLE FOODS MARKET — Total $87.42",
    ocr_blocks: [
      block("WHOLE FOODS MARKET", 60, 40, 320, 26),
      block("Organic strawberries  $11.98", 60, 200, 320, 18),
      block("TOTAL  $87.42", 60, 440, 220, 22),
    ],
  },
};

export function getDemoDocumentDetail(id: string): DocumentDetail | null {
  const base = DEMO_DOCUMENTS.find((d) => d.id === id);
  if (!base) return null;
  const overrides = DETAIL_OVERRIDES[id] ?? {};
  return {
    ...base,
    doc_text: overrides.doc_text ?? `${base.primaryEntity} — ${base.totalValue}`,
    ocr_blocks: overrides.ocr_blocks ?? [],
  };
}

export function getDemoRelated(id: string, limit = 4): RelatedDocument[] {
  const base = DEMO_DOCUMENTS.find((d) => d.id === id);
  if (!base) return [];
  // Same type first, then anything else; assign decreasing similarity scores
  const sameType = DEMO_DOCUMENTS.filter((d) => d.id !== id && d.type === base.type);
  const others = DEMO_DOCUMENTS.filter((d) => d.id !== id && d.type !== base.type);
  return [...sameType, ...others]
    .slice(0, limit)
    .map((d, i) => ({ ...d, similarity: Math.max(40, 92 - i * 11) }));
}

// ── Radar (upcoming events) ─────────────────────────────────────────
export const DEMO_RADAR: RadarEvent[] = [
  {
    id: "2",
    type: "Fine",
    fileUrl: `${DEMO}/SFO_Parking_Ticket.jpg`,
    primaryEntity: "SFO Parking Citation",
    date: daysFromNow(11),
    description: "Payment due",
    totalValue: "$78.00",
  },
  {
    id: "4",
    type: "Invoice",
    fileUrl: `${DEMO}/X_upload_test2.jpg`,
    primaryEntity: "Bay Area Dental",
    date: daysFromNow(18),
    description: "Invoice due",
    totalValue: "$240.00",
  },
  {
    id: "19",
    type: "Subscription",
    fileUrl: `${DEMO}/doordashapp.png`,
    primaryEntity: "Netflix",
    date: daysFromNow(20),
    description: "Subscription renews",
    totalValue: "$15.49",
  },
  {
    id: "20",
    type: "Subscription",
    fileUrl: `${DEMO}/doordashapp.png`,
    primaryEntity: "Spotify Premium",
    date: daysFromNow(23),
    description: "Subscription renews",
    totalValue: "$11.99",
  },
  {
    id: "21",
    type: "Subscription",
    fileUrl: `${DEMO}/doordashapp.png`,
    primaryEntity: "Adobe Creative Cloud",
    date: daysFromNow(30),
    description: "Subscription renews",
    totalValue: "$54.99",
  },
  {
    id: "13",
    type: "Form",
    fileUrl: `${DEMO}/healthinsurance.png`,
    primaryEntity: "Blue Shield Health Renewal",
    date: daysFromNow(45),
    description: "Policy renewal",
    totalValue: "—",
  },
  {
    id: "1",
    type: "Rental Agreement",
    fileUrl: `${DEMO}/SAMPLE-Simple-1-Page-Lease-Agreement-790x1024.webp`,
    primaryEntity: "Lease Renewal — 742 Evergreen Terrace",
    date: daysFromNow(305),
    description: "Lease ends",
    totalValue: "$2,450.00",
  },
];

// ── Analytics ───────────────────────────────────────────────────────
function monthLabel(n: number): string {
  const d = new Date(today);
  d.setMonth(d.getMonth() - n);
  return d.toLocaleString("en-US", { month: "short", year: "2-digit" });
}

export const DEMO_SPENDING: SpendingAnalytics = {
  by_merchant: [
    { merchant: "Whole Foods Market", total: 199.49, count: 2 },
    { merchant: "Costco Wholesale", total: 214.55, count: 1 },
    { merchant: "Target", total: 133.29, count: 2 },
    { merchant: "DoorDash", total: 52.03, count: 2 },
    { merchant: "Walgreens Pharmacy", total: 24.18, count: 1 },
    { merchant: "United Airlines", total: 418.20, count: 1 },
    { merchant: "SFO Parking Authority", total: 78.00, count: 1 },
    { merchant: "Bay Area Dental", total: 240.00, count: 1 },
  ],
  by_month: [
    { month: monthLabel(5), total: 312.40 },
    { month: monthLabel(4), total: 488.10 },
    { month: monthLabel(3), total: 78.30 },
    { month: monthLabel(2), total: 744.82 },
    { month: monthLabel(1), total: 318.21 },
    { month: monthLabel(0), total: 197.60 },
  ],
  total: 2139.43,
};

export const DEMO_RECURRING: RecurringAnalytics = {
  recurring: [
    {
      merchant: "Netflix",
      is_recurring: true,
      interval_days: 30,
      monthly_estimate: 15.49,
      annual_estimate: 185.88,
      next_renewal_date: daysFromNow(20),
      last_date: monthsAgo(0, 4),
      transaction_count: 6,
    },
    {
      merchant: "Spotify Premium",
      is_recurring: true,
      interval_days: 30,
      monthly_estimate: 11.99,
      annual_estimate: 143.88,
      next_renewal_date: daysFromNow(23),
      last_date: monthsAgo(0, 7),
      transaction_count: 6,
    },
    {
      merchant: "Adobe Creative Cloud",
      is_recurring: true,
      interval_days: 30,
      monthly_estimate: 54.99,
      annual_estimate: 659.88,
      next_renewal_date: daysFromNow(30),
      last_date: monthsAgo(0, 14),
      transaction_count: 6,
    },
  ],
  total_monthly: 82.47,
  total_annual: 989.64,
  count: 3,
};

export const DEMO_TRIPS: TripAnalytics = {
  trips: [
    {
      start_date: monthsAgo(2, 4),
      end_date: monthsAgo(2, 8),
      total_cost: 466.20,
      document_count: 2,
      location_hint: "JFK / NYC",
      documents: [
        { doc_id: 6, merchant: "United Airlines", date: monthsAgo(2, 4), amount: 418.20 },
        { doc_id: 15, merchant: "Allianz Travel Insurance", date: monthsAgo(2, 4), amount: 48.00 },
      ],
    },
  ],
  total_trip_spending: 466.20,
  count: 1,
};

export const DEMO_INCOME: IncomeAnalytics = {
  earnings: [
    { employer: "Acme Robotics, Inc.", date: monthsAgo(0, 1), net_pay: 4612.30, gross_pay: 6250.00, doc_id: 22 },
    { employer: "Acme Robotics, Inc.", date: monthsAgo(1, 15), net_pay: 4612.30, gross_pay: 6250.00, doc_id: 23 },
  ],
  deductions: {
    canonical: {
      "Federal Tax": 812.50,
      "State Tax": 287.40,
      "Social Security": 387.50,
      "Medicare": 90.63,
      "401(k)": 312.50,
      "Health Insurance": 184.20,
    },
    other: {
      "Commuter Benefit": 75.00,
    },
    total_deductions: 2149.73,
  },
  recurring_income: [
    {
      employer: "Acme Robotics, Inc.",
      frequency: "Bi-weekly",
      avg_net_pay: 4612.30,
      monthly_estimate: 9991.32,
      annual_estimate: 119895.80,
      last_pay_date: monthsAgo(0, 1),
      paycheck_count: 2,
    },
  ],
  total_net: 9224.60,
  total_gross: 12500.00,
};
