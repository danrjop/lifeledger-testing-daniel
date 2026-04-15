/**
 * Frontend-only demo seed data — every record below is grounded in what
 * the actual images in /public/demo/ contain. Synthetic supplementary
 * records (reusing existing images) add enough volume for the financial
 * insights to look real, but their merchants/dates are clearly plausible.
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

const DEMO = "/demo";

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
  // 1 — Lease template (Tenant: Karla Reagan, Landlord: Lindsay Schein)
  {
    id: "1",
    type: "Rental Agreement",
    fileUrl: `${DEMO}/SAMPLE-Simple-1-Page-Lease-Agreement-790x1024.webp`,
    status: "Done",
    primaryEntity: "Lindsay Schein (Landlord)",
    secondaryEntity: "Tenant: Karla Reagan",
    primaryDate: monthsAgo(2, 1),
    secondaryDate: daysFromNow(305),
    totalValue: "$2,450.00 / mo",
    metadata: {
      "Monthly Rent": "$2,450.00",
      "Tenant": "Karla Reagan",
      "Landlord": "Lindsay Schein",
      "Lease Type": "Residential — Month-to-month convertible to fixed",
    },
    radarProcessed: true,
  },
  // 2 — SFO parking RECEIPT (already paid, $8.00, 01/30/26)
  {
    id: "2",
    type: "Receipt",
    fileUrl: `${DEMO}/SFO_Parking_Ticket.jpg`,
    status: "Done",
    primaryEntity: "SFO Parking",
    secondaryEntity: "Receipt no 3415/0611/611",
    primaryDate: "2026-01-30",
    totalValue: "$8.00",
    metadata: {
      "Paid": "01/30/26 17:07",
      "Length of Stay": "0 Dy 0 Hr 33 Min",
      "Payment": "Credit Visa",
    },
    radarProcessed: true,
  },
  // 3 — Yongfatt Enterprise simplified tax invoice (Malaysia, 25/12/2018)
  {
    id: "3",
    type: "Receipt",
    fileUrl: `${DEMO}/X_upload_test.jpg`,
    status: "Done",
    primaryEntity: "Yongfatt Enterprise",
    secondaryEntity: "Johor Bahru, Malaysia",
    primaryDate: "2018-12-25",
    totalValue: "RM 80.91",
    lineItems: [
      { description: "ELEGANT SCH TR BAG 15 (E8318)", qty: "1", unitPrice: "RM 80.91", amount: "RM 80.91" },
    ],
    metadata: {
      "GST ID": "000849813504",
      "Doc No": "CS00031663",
      "Tax Code": "SR (0%)",
    },
    radarProcessed: true,
  },
  // 4 — Pasar Raya Mega Maju tax invoice (pet food, Malaysia, 03/07/2018)
  {
    id: "4",
    type: "Invoice",
    fileUrl: `${DEMO}/X_upload_test2.jpg`,
    status: "Done",
    primaryEntity: "Pasar Raya Mega Maju (Semenyih)",
    secondaryEntity: "Pet food",
    primaryDate: "2018-07-03",
    totalValue: "RM 30.45",
    lineItems: [
      { description: "Pro Balance 400gm — Beef", qty: "1", unitPrice: "RM 17.40", amount: "RM 17.40" },
      { description: "Pro Balance Lamb 400gm", qty: "1", unitPrice: "RM 13.05", amount: "RM 13.05" },
    ],
    metadata: { "Invoice No": "01-283886", "Cashier": "SITI" },
    radarProcessed: true,
  },
  // 5 — Anbicyn F.C. Tablets 625mg (medication packet photo, no price)
  {
    id: "5",
    type: "Form",
    fileUrl: `${DEMO}/antibiotic.JPG`,
    status: "Done",
    primaryEntity: "Anbicyn F.C. Tablets 625mg",
    secondaryEntity: "Amoxicillin trihydrate + Potassium clavulanate",
    primaryDate: monthsAgo(1, 22),
    totalValue: "—",
    metadata: { "Manufacturer": "Sinphar Pharmaceutical", "Note": "Photo of medication packet — no price on packaging" },
    radarProcessed: true,
  },
  // 6 — Air Company boarding pass (Djokic Ksenija, BEG→DCA, 21.05.2013)
  {
    id: "6",
    type: "Other",
    fileUrl: `${DEMO}/boardingpass.jpg`,
    status: "Done",
    primaryEntity: "Air Company — BEG → DCA",
    secondaryEntity: "Passenger: Djokic Ksenija · Flight HG285",
    primaryDate: "2013-05-21",
    totalValue: "—",
    metadata: { "Seat": "A1", "Gate": "G7", "Boarding Till": "05:40" },
    radarProcessed: true,
  },
  // 7 — Hardware-store price tag for $2.08 concrete block
  {
    id: "7",
    type: "Other",
    fileUrl: `${DEMO}/concreteblocktest.JPG`,
    status: "Needs Review",
    primaryEntity: "Gray Concrete Block — price tag",
    secondaryEntity: "$2.08 · 6×8×16 in",
    primaryDate: monthsAgo(0, today.getDate() - 1),
    totalValue: "—",
    metadata: { "Note": "Photo of an in-store price tag — not a receipt", "Aisle/Bay/Loc": "39 / 9 / 15" },
    radarProcessed: true,
  },
  // 8 — Safeway/Albertsons weekly coupon ad (no transaction)
  {
    id: "8",
    type: "Other",
    fileUrl: `${DEMO}/coupons1.jpeg`,
    status: "Done",
    primaryEntity: "Safeway / Albertsons — Weekly ad",
    secondaryEntity: "Members save up to 35% Weekly",
    primaryDate: monthsAgo(0, today.getDate() - 7),
    totalValue: "—",
    metadata: { "Note": "Coupon flyer — promotional ad, no transaction" },
    radarProcessed: true,
  },
  // 9 — Crying cat meme (uploaded by mistake)
  {
    id: "9",
    type: "Other",
    fileUrl: `${DEMO}/crycat.png`,
    status: "Needs Review",
    primaryEntity: "Image — no document detected",
    secondaryEntity: "(crying cat meme)",
    primaryDate: monthsAgo(0, today.getDate() - 2),
    totalValue: "—",
    radarProcessed: true,
  },
  // 10 — iPhone Notes screenshot: "Important event 4/24/2026"
  {
    id: "10",
    type: "Other",
    fileUrl: `${DEMO}/datetestpic.PNG`,
    status: "Done",
    primaryEntity: "Note — \"Important event\"",
    secondaryEntity: "Important stuff happening",
    primaryDate: "2026-04-24",
    totalValue: "—",
    metadata: { "Source": "iPhone Notes screenshot" },
    radarProcessed: true,
  },
  // 11 — Chang Gung Memorial Hospital letter (blank template)
  {
    id: "11",
    type: "Form",
    fileUrl: `${DEMO}/doctor_letter.jpg`,
    status: "Needs Review",
    primaryEntity: "Chang Gung Memorial Hospital — Taipei",
    secondaryEntity: "Letter template (Name / Diagnosis / Date all blank)",
    primaryDate: monthsAgo(2, 19),
    totalValue: "—",
    metadata: { "Address": "1253 E Address Svin Avd. Taipei, Boinui", "Note": "Form is blank — no patient info filled in" },
    radarProcessed: true,
  },
  // 12 — DoorDash menu screenshot (Pike Place Chowder — browsing, no order placed)
  {
    id: "12",
    type: "Other",
    fileUrl: `${DEMO}/doordashapp.png`,
    status: "Done",
    primaryEntity: "DoorDash — Pike Place Chowder",
    secondaryEntity: "Menu browse · 4.6★ · 2K+ ratings",
    primaryDate: monthsAgo(0, today.getDate() - 5),
    totalValue: "—",
    metadata: { "Note": "Screenshot of restaurant menu (browsing) — no order was placed" },
    radarProcessed: true,
  },
  // 13 — BlueCross BlueShield insurance card
  {
    id: "13",
    type: "Form",
    fileUrl: `${DEMO}/healthinsurance.png`,
    status: "Done",
    primaryEntity: "BlueCross BlueShield",
    secondaryEntity: "Member ID XYZ123456789 · PPO",
    primaryDate: monthsAgo(4, 1),
    totalValue: "—",
    metadata: {
      "Plan": "PPO",
      "Office Visit Copay": "$15",
      "Specialist Copay": "$35",
      "Emergency": "$75",
      "Deductible": "$50",
      "Group No": "023457",
      "BIN": "987654",
    },
    radarProcessed: true,
  },
  // 14 — Smith and Company pay stub (hourly): gross $774.00, net $560.71
  {
    id: "14",
    type: "Payslip",
    fileUrl: `${DEMO}/images.png`,
    status: "Done",
    primaryEntity: "Smith and Company",
    secondaryEntity: "Pay stub — hourly",
    primaryDate: monthsAgo(0, 1),
    totalValue: "$560.71",
    metadata: {
      "Pay Rate": "$18.00 / hr (overtime $27.00)",
      "Regular Hours": "40",
      "Overtime Hours": "2",
      "Gross Earnings": "$774.00",
      "Total Deductions": "$213.29",
      "Net Earnings": "$560.71",
      "Federal W/H": "$69.45",
      "Medicare": "$11.22",
      "FICA": "$47.99",
      "CA State W/H": "$26.45",
      "CA State DI": "$6.19",
      "401(k)": "$52.00",
    },
    radarProcessed: true,
  },
  // 15 — Allianz Comprehensive (Canadian) travel insurance policy
  {
    id: "15",
    type: "Form",
    fileUrl: `${DEMO}/insurancepolicytravel.png`,
    status: "Done",
    primaryEntity: "Allianz Comprehensive Coverage",
    secondaryEntity: "Underwritten by CUMIS General Insurance · AZGA Service Canada",
    primaryDate: monthsAgo(2, 4),
    totalValue: "—",
    metadata: {
      "Trip Cancellation": "Up to $20,000 CAD",
      "Trip Interruption": "Up to $20,000 CAD",
      "Emergency Medical": "Up to $5,000,000 CAD",
      "Baggage": "$1,000 CAD",
      "Eligibility": "Travellers age 64 or younger",
      "Max Trip Length": "30 days",
    },
    radarProcessed: true,
  },
  // 16 — McLovin Hawaii Driver License (the Superbad fake ID)
  {
    id: "16",
    type: "Other",
    fileUrl: `${DEMO}/mclovinid.jpg`,
    status: "Done",
    primaryEntity: "Hawaii Driver License — McLOVIN",
    secondaryEntity: "892 Momona St, Honolulu HI 96820",
    primaryDate: "1998-06-18",
    secondaryDate: "2008-06-03",
    totalValue: "—",
    metadata: {
      "Number": "01-47-87441",
      "DOB": "06/03/1981",
      "Expires": "06/03/2008 (expired)",
      "Note": "Yes, this is the McLovin ID from Superbad",
    },
    radarProcessed: true,
  },
  // 17 — OpenAI ChatGPT Plus subscription confirmation ($20.00, Jan 27 2026)
  {
    id: "17",
    type: "Subscription",
    fileUrl: `${DEMO}/test6.jpg`,
    status: "Done",
    primaryEntity: "OpenAI — ChatGPT Plus",
    secondaryEntity: "First month free, $20.00/mo thereafter",
    primaryDate: "2026-01-27",
    secondaryDate: daysFromNow(13),
    totalValue: "$20.00",
    metadata: {
      "Order Number": "sub_1SuS4HC6h1nxGoI3kksELjgQ",
      "Order Date": "Jan 27, 2026",
      "Plan": "ChatGPT Plus Subscription",
      "Payment Method": "Visa-7686",
      "Renews": daysFromNow(13),
      "Frequency": "Monthly",
    },
    radarProcessed: true,
  },
  // 18 — Yellow sticky note from mom about doc appt
  {
    id: "18",
    type: "Other",
    fileUrl: `${DEMO}/teststickynote.JPG`,
    status: "Done",
    primaryEntity: "Sticky note — \"Doc apt at 2:30 tomo\"",
    secondaryEntity: "From: mom (xoxo)",
    primaryDate: monthsAgo(0, today.getDate() - 8),
    totalValue: "—",
    metadata: { "Source": "Handwritten yellow sticky note" },
    radarProcessed: true,
  },

  // ── Synthetic supplementary records (reuse existing image files) ──
  // 19 — ChatGPT Plus prior renewal
  {
    id: "19",
    type: "Subscription",
    fileUrl: `${DEMO}/test6.jpg`,
    status: "Done",
    primaryEntity: "OpenAI — ChatGPT Plus",
    secondaryEntity: "Monthly renewal",
    primaryDate: monthsAgo(1, 27),
    totalValue: "$20.00",
    metadata: { "Frequency": "Monthly", "Payment Method": "Visa-7686" },
    radarProcessed: true,
  },
  {
    id: "20",
    type: "Subscription",
    fileUrl: `${DEMO}/test6.jpg`,
    status: "Done",
    primaryEntity: "OpenAI — ChatGPT Plus",
    secondaryEntity: "Monthly renewal",
    primaryDate: monthsAgo(2, 27),
    totalValue: "$20.00",
    metadata: { "Frequency": "Monthly" },
    radarProcessed: true,
  },
  // 21–25 — Smith and Company pay stub history (bi-weekly)
  {
    id: "21",
    type: "Payslip",
    fileUrl: `${DEMO}/images.png`,
    status: "Done",
    primaryEntity: "Smith and Company",
    secondaryEntity: "Prior pay period",
    primaryDate: monthsAgo(0, 15),
    totalValue: "$560.71",
    metadata: { "Gross Earnings": "$774.00", "Net Earnings": "$560.71" },
    radarProcessed: true,
  },
  {
    id: "22",
    type: "Payslip",
    fileUrl: `${DEMO}/images.png`,
    status: "Done",
    primaryEntity: "Smith and Company",
    secondaryEntity: "Prior pay period",
    primaryDate: monthsAgo(1, 1),
    totalValue: "$540.30",
    metadata: { "Gross Earnings": "$720.00", "Net Earnings": "$540.30" },
    radarProcessed: true,
  },
  {
    id: "23",
    type: "Payslip",
    fileUrl: `${DEMO}/images.png`,
    status: "Done",
    primaryEntity: "Smith and Company",
    secondaryEntity: "Prior pay period",
    primaryDate: monthsAgo(1, 15),
    totalValue: "$560.71",
    metadata: { "Gross Earnings": "$774.00", "Net Earnings": "$560.71" },
    radarProcessed: true,
  },
  // 24–27 — Synthetic Yongfatt + Pasar Raya repeat visits to give the
  // chart something to chart. Same merchants, different dates.
  {
    id: "24",
    type: "Receipt",
    fileUrl: `${DEMO}/X_upload_test.jpg`,
    status: "Done",
    primaryEntity: "Yongfatt Enterprise",
    primaryDate: monthsAgo(2, 9),
    totalValue: "RM 124.50",
    radarProcessed: true,
  },
  {
    id: "25",
    type: "Receipt",
    fileUrl: `${DEMO}/X_upload_test2.jpg`,
    status: "Done",
    primaryEntity: "Pasar Raya Mega Maju",
    primaryDate: monthsAgo(1, 22),
    totalValue: "RM 47.80",
    radarProcessed: true,
  },
  {
    id: "26",
    type: "Receipt",
    fileUrl: `${DEMO}/SFO_Parking_Ticket.jpg`,
    status: "Done",
    primaryEntity: "SFO Parking",
    primaryDate: monthsAgo(1, 11),
    totalValue: "$12.00",
    radarProcessed: true,
  },
  {
    id: "27",
    type: "Receipt",
    fileUrl: `${DEMO}/X_upload_test.jpg`,
    status: "Done",
    primaryEntity: "Yongfatt Enterprise",
    primaryDate: monthsAgo(3, 14),
    totalValue: "RM 56.20",
    radarProcessed: true,
  },
];

// ── Document detail (OCR overlay text for the viewer) ───────────────
const DETAIL_OVERRIDES: Record<string, Partial<DocumentDetail>> = {
  "1": {
    doc_text:
      "SAMPLE RENTAL LEASE AGREEMENT. Premises: ____. Tenant: Karla Reagan. Landlord: Lindsay Schein. Term: month-to-month, convertible to fixed.",
    ocr_blocks: [
      block("SAMPLE RENTAL LEASE AGREEMENT", 60, 30, 360, 22),
      block("Landlord:  Lindsay Schein", 30, 470, 260, 18),
      block("Tenant:  Karla Reagan", 30, 510, 220, 18),
    ],
  },
  "2": {
    doc_text:
      "SFO Parking — Receipt no 3415/0611/611. Pay Parking Ticket $8.00. Entered 01/30/26 16:34. Paid 01/30/26 17:07. Length of stay 0 Dy 0 Hr 33 Min. Payment: Credit Visa.",
    ocr_blocks: [
      block("Receipt no 3415/0611/611  01/30/26", 80, 70, 380, 18),
      block("Pay Parking Ticket   $   8.00", 80, 130, 320, 18),
      block("Total Amount   $   8.00", 80, 200, 280, 18),
      block("RECEIPT", 380, 320, 110, 28),
    ],
  },
  "3": {
    doc_text:
      "YONGFATT ENTERPRISE (JM0517726) — Simplified Tax Invoice. ELEGANT SCH TR BAG 15 — RM 80.91. Total RM 80.91. GST ID 000849813504. Date 25/12/2018.",
    ocr_blocks: [
      block("YONGFATT ENTERPRISE", 90, 95, 290, 22),
      block("SIMPLIFIED TAX INVOICE", 110, 240, 250, 18),
      block("ELEGANT SCH TR BAG 15   80.91", 60, 460, 360, 18),
      block("Total Sales (Inclusive of GST)  80.90", 50, 660, 360, 18),
    ],
  },
  "4": {
    doc_text:
      "PASAR RAYA MEGA MAJU (Semenyih) — Tax Invoice. Pro Balance 400GM — Beef RM 17.40. Pro Balance Lamb 400GM RM 13.05. Total RM 30.45.",
  },
  "13": {
    doc_text:
      "BlueCross BlueShield. Member ID XYZ123456789. Plan PPO. Office Visit $15. Specialist $35. Emergency $75. Deductible $50.",
  },
  "14": {
    doc_text:
      "SMITH AND COMPANY, INC. Pay stub (hourly). Regular 40 hrs @ $18.00 = $720.00. Overtime 2 hrs @ $27.00 = $54.00. Gross $774.00. Total deductions $213.29. Net $560.71.",
  },
  "17": {
    doc_text:
      "OpenAI — ChatGPT Plus. Order sub_1SuS4HC6h1nxGoI3kksELjgQ. Order date Jan 27, 2026. ChatGPT Plus Subscription $20.00. Payment Visa-7686. Renews monthly.",
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
  const sameType = DEMO_DOCUMENTS.filter((d) => d.id !== id && d.type === base.type);
  const others = DEMO_DOCUMENTS.filter((d) => d.id !== id && d.type !== base.type);
  return [...sameType, ...others]
    .slice(0, limit)
    .map((d, i) => ({ ...d, similarity: Math.max(40, 92 - i * 11) }));
}

// ── Radar (upcoming events) — only things actually due in the future
export const DEMO_RADAR: RadarEvent[] = [
  {
    id: "10",
    type: "Other",
    fileUrl: `${DEMO}/datetestpic.PNG`,
    primaryEntity: "Important event (from your Notes)",
    date: "2026-04-24",
    description: "Note flagged \"Important stuff happening\"",
    totalValue: "—",
  },
  {
    id: "17",
    type: "Subscription",
    fileUrl: `${DEMO}/test6.jpg`,
    primaryEntity: "ChatGPT Plus renews",
    date: daysFromNow(13),
    description: "Monthly subscription renewal",
    totalValue: "$20.00",
  },
  {
    id: "1",
    type: "Rental Agreement",
    fileUrl: `${DEMO}/SAMPLE-Simple-1-Page-Lease-Agreement-790x1024.webp`,
    primaryEntity: "Lease term review (Schein/Reagan)",
    date: daysFromNow(305),
    description: "Lease term checkpoint",
    totalValue: "$2,450.00 / mo",
  },
];

// ── Analytics — USD-equivalent rollup. The two Malaysian-receipt
// totals are converted at ~RM 4.5 / USD for the chart so the bars
// aren't currency-mixed. Pay stub income is the actual hourly figure.
function monthLabel(n: number): string {
  const d = new Date(today);
  d.setMonth(d.getMonth() - n);
  return d.toLocaleString("en-US", { month: "short", year: "2-digit" });
}

export const DEMO_SPENDING: SpendingAnalytics = {
  by_merchant: [
    { merchant: "Yongfatt Enterprise (MY)", total: 57.21, count: 3 },     // RM 261.61 / 4.57
    { merchant: "OpenAI — ChatGPT Plus", total: 60.00, count: 3 },
    { merchant: "Pasar Raya Mega Maju (MY)", total: 17.13, count: 2 },    // RM 78.25 / 4.57
    { merchant: "SFO Parking", total: 20.00, count: 2 },
  ],
  by_month: [
    { month: monthLabel(3), total: 32.30 },
    { month: monthLabel(2), total: 47.25 },
    { month: monthLabel(1), total: 42.46 },
    { month: monthLabel(0), total: 32.33 },
  ],
  total: 154.34,
};

export const DEMO_RECURRING: RecurringAnalytics = {
  recurring: [
    {
      merchant: "OpenAI — ChatGPT Plus",
      is_recurring: true,
      interval_days: 30,
      monthly_estimate: 20.00,
      annual_estimate: 240.00,
      next_renewal_date: daysFromNow(13),
      last_date: "2026-01-27",
      transaction_count: 3,
    },
  ],
  total_monthly: 20.00,
  total_annual: 240.00,
  count: 1,
};

export const DEMO_TRIPS: TripAnalytics = {
  trips: [
    {
      start_date: "2013-05-21",
      end_date: "2013-05-21",
      total_cost: 0,
      document_count: 1,
      location_hint: "BEG → DCA (Belgrade → Washington DC)",
      documents: [
        { doc_id: 6, merchant: "Air Company HG285", date: "2013-05-21", amount: 0 },
      ],
    },
  ],
  total_trip_spending: 0,
  count: 1,
};

export const DEMO_INCOME: IncomeAnalytics = {
  earnings: [
    { employer: "Smith and Company", date: monthsAgo(0, 1), net_pay: 560.71, gross_pay: 774.00, doc_id: 14 },
    { employer: "Smith and Company", date: monthsAgo(0, 15), net_pay: 560.71, gross_pay: 774.00, doc_id: 21 },
    { employer: "Smith and Company", date: monthsAgo(1, 1), net_pay: 540.30, gross_pay: 720.00, doc_id: 22 },
    { employer: "Smith and Company", date: monthsAgo(1, 15), net_pay: 560.71, gross_pay: 774.00, doc_id: 23 },
  ],
  deductions: {
    canonical: {
      "Federal W/H": 69.45,
      "FICA": 47.99,
      "Medicare": 11.22,
      "CA State W/H": 26.45,
      "CA State DI": 6.19,
      "401(k)": 52.00,
    },
    other: {},
    total_deductions: 213.30,
  },
  recurring_income: [
    {
      employer: "Smith and Company",
      frequency: "Bi-weekly (hourly @ $18/hr)",
      avg_net_pay: 555.61,
      monthly_estimate: 1203.49,
      annual_estimate: 14441.86,
      last_pay_date: monthsAgo(0, 1),
      paycheck_count: 4,
    },
  ],
  total_net: 2222.43,
  total_gross: 3042.00,
};
