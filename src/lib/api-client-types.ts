// Shared type definitions for the demo API client. Pure types — no runtime code,
// so both the mock client and seed-data modules can import without circular deps.

export interface ApiError extends Error {
  status?: number;
}

export interface UploadedDoc {
  doc_id: number;
  s3_key: string;
  filename: string;
  status: string;
}

export interface RejectedFile {
  filename: string;
  message: string;
}

export interface UploadAndProcessResponse {
  uploaded: UploadedDoc[];
  count: number;
  message: string;
  rejected?: RejectedFile[];
}

export type DocumentType =
  | "Receipt"
  | "Subscription"
  | "Invoice"
  | "Fine"
  | "Form"
  | "Payslip"
  | "Rental Agreement"
  | "Other";
export type StatusType = "Processing" | "Needs Review" | "Done";

export interface LineItem {
  description: string;
  qty?: string;
  unitPrice?: string;
  amount: string;
}

export interface Document {
  id: string;
  type: DocumentType;
  fileUrl: string;
  status: StatusType;
  primaryEntity: string;
  secondaryEntity?: string;
  primaryDate: string;
  secondaryDate?: string;
  totalValue: string;
  lineItems?: LineItem[];
  metadata?: Record<string, string>;
  radarProcessed?: boolean;
}

export interface SafetyInfo {
  strategy: "REFUSE_ONLY" | "REFUSE_REDIRECT" | "DEESCALATE_SUPPORT" | "ASK_CLARIFY_SAFE";
  message: string;
  detail?: string | null;
}

export interface GroundednessInfo {
  ungrounded_pct: number;
  message: string;
}

export interface ChartDataItem {
  type: "spending_by_merchant" | "spending_over_time" | "receipt_table";
  title: string;
  data: Record<string, unknown>[];
  summary?: Record<string, unknown>;
}

export interface SearchResult {
  answer: string;
  documents: Document[];
  query: string;
  session_id: number;
  conversation_id: number;
  safety?: SafetyInfo | null;
  groundedness?: GroundednessInfo | null;
  chart_data?: ChartDataItem[] | null;
  followUps?: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  documents?: Document[];
  sessionId?: number;
  safety?: SafetyInfo | null;
  groundedness?: GroundednessInfo | null;
  chartData?: ChartDataItem[] | null;
  isLoading?: boolean;
  followUps?: string[];
}

export interface AskResponse {
  answer: string;
  sources: string[];
  safety?: SafetyInfo | null;
  groundedness?: GroundednessInfo | null;
}

export interface DeleteResponse {
  deleted_count: number;
  s3_deleted: number;
  s3_errors: number;
  message: string;
}

export interface RadarEvent {
  id: string;
  type: DocumentType;
  fileUrl: string;
  primaryEntity: string;
  date: string;
  description?: string;
  totalValue: string;
}

export interface RadarResponse {
  events: RadarEvent[];
  count: number;
}

export interface RelatedDocument extends Document {
  similarity: number;
}

export interface OcrBlock {
  text: string;
  confidence: number;
  bbox: number[][];
}

export interface DocumentDetail extends Document {
  ocr_blocks?: OcrBlock[];
  doc_text?: string;
}

export interface RegenerateResult {
  answer: string;
  safety?: SafetyInfo;
  groundedness?: GroundednessInfo;
  chart_data?: ChartDataItem[] | null;
}

export interface MerchantSpending {
  merchant: string;
  total: number;
  count: number;
}

export interface MonthlySpending {
  month: string;
  total: number;
}

export interface SpendingAnalytics {
  by_merchant: MerchantSpending[];
  by_month: MonthlySpending[];
  total: number;
}

export interface RecurringCost {
  merchant: string;
  is_recurring: boolean;
  interval_days: number;
  monthly_estimate: number;
  annual_estimate: number;
  next_renewal_date: string;
  last_date: string;
  transaction_count: number;
}

export interface RecurringAnalytics {
  recurring: RecurringCost[];
  total_monthly: number;
  total_annual: number;
  count: number;
}

export interface TripDocument {
  doc_id: number;
  merchant: string;
  date: string;
  amount: number;
}

export interface Trip {
  start_date: string;
  end_date: string;
  total_cost: number;
  document_count: number;
  location_hint: string | null;
  documents: TripDocument[];
}

export interface TripAnalytics {
  trips: Trip[];
  total_trip_spending: number;
  count: number;
}

export interface EarningsSummary {
  employer: string;
  date: string | null;
  net_pay: number | null;
  gross_pay: number | null;
  doc_id: number;
}

export interface DeductionsBreakdown {
  canonical: Record<string, number>;
  other: Record<string, number>;
  total_deductions: number;
}

export interface RecurringIncome {
  employer: string;
  frequency: string;
  avg_net_pay: number;
  monthly_estimate: number;
  annual_estimate: number;
  last_pay_date: string | null;
  paycheck_count: number;
}

export interface IncomeAnalytics {
  earnings: EarningsSummary[];
  deductions: DeductionsBreakdown;
  recurring_income: RecurringIncome[];
  total_net: number;
  total_gross: number;
}
