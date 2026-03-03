/**
 * API client for LifeLedger backend.
 * Calls FastAPI backend directly with auth token from Cognito.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ApiError extends Error {
  status?: number;
}

// Token getter - set by AuthProvider on mount
let _getToken: (() => Promise<string | null>) | null = null;

/**
 * Set the token getter function (called by AuthProvider).
 */
export function setTokenGetter(getter: () => Promise<string | null>) {
  _getToken = getter;
}

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = _getToken ? await _getToken() : null;
  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    const err = new Error(error.detail || error.error || `API error: ${res.status}`);
    (err as ApiError).status = res.status;
    throw err;
  }

  return res.json();
}

// Types matching backend responses
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

export type DocumentType = "Receipt" | "Subscription" | "Invoice" | "Fine" | "Form" | "Other";
export type StatusType = "Processing" | "Needs Review" | "Done";

export interface Document {
  id: string;
  type: DocumentType;
  fileUrl: string;
  status: StatusType;
  primaryEntity: string;
  primaryDate: string;
  totalValue: string;
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
}

export interface AskResponse {
  answer: string;
  sources: string[];
  safety?: SafetyInfo | null;
  groundedness?: GroundednessInfo | null;
}

/**
 * Upload files and start OCR processing.
 */
export async function uploadAndProcess(
  files: File[]
): Promise<UploadAndProcessResponse> {
  const token = _getToken ? await _getToken() : null;
  if (!token) {
    throw new Error("Not authenticated");
  }

  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await fetch(`${API_URL}/uploadAndProcess`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(error.error || `API error: ${res.status}`);
  }

  return res.json();
}

/**
 * Get user's documents.
 */
export async function getDocuments(): Promise<Document[]> {
  return apiCall<Document[]>("/documents");
}

/**
 * Search documents with semantic similarity.
 */
export async function searchDocuments(query: string, conversationId?: number): Promise<SearchResult> {
  return apiCall<SearchResult>("/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, conversation_id: conversationId ?? null }),
  });
}

/**
 * Ask the agent a question.
 */
export async function askAgent(question: string): Promise<AskResponse> {
  return apiCall<AskResponse>("/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
}

export interface DeleteResponse {
  deleted_count: number;
  s3_deleted: number;
  s3_errors: number;
  message: string;
}

/**
 * Delete multiple documents.
 */
export async function deleteDocuments(
  documentIds: string[]
): Promise<DeleteResponse> {
  return apiCall<DeleteResponse>("/documents", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ document_ids: documentIds.map(Number) }),
  });
}

export interface RadarEvent {
  id: string;
  type: DocumentType;
  fileUrl: string;
  primaryEntity: string;
  date: string;
  description?: string;  // e.g., "Payment due", "Subscription renews"
  totalValue: string;
}

export interface RadarResponse {
  events: RadarEvent[];
  count: number;
}

/**
 * Get upcoming events for the radar (dates within next N days).
 */
export async function getRadarEvents(days: number = 30): Promise<RadarResponse> {
  return apiCall<RadarResponse>(`/radar?days=${days}`);
}

/**
 * Submit manual review for a "Needs Review" document.
 * Updates doc_text with the user's note (or "[Reviewed]" if empty).
 */
export async function reviewDocument(docId: string, note: string): Promise<void> {
  await apiCall(`/documents/${docId}/review`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note }),
  });
}

export interface RelatedDocument extends Document {
  similarity: number;  // 0-100 percentage
}

// OCR bounding box as returned from backend
export interface OcrBlock {
  text: string;
  confidence: number;
  bbox: number[][];  // 4-point polygon: [[x1,y1], [x2,y2], [x3,y3], [x4,y4]]
}

export interface DocumentDetail extends Document {
  ocr_blocks?: OcrBlock[];
  doc_text?: string;
}

/**
 * Get documents similar to the given document using vector similarity.
 */
export async function getRelatedDocuments(
  docId: string,
  limit: number = 4
): Promise<RelatedDocument[]> {
  return apiCall<RelatedDocument[]>(`/documents/${docId}/related?limit=${limit}`);
}

/**
 * Get a single document by ID with full details including ocr_blocks.
 */
export async function getDocument(docId: string): Promise<DocumentDetail> {
  return apiCall<DocumentDetail>(`/documents/${docId}`);
}

/**
 * Regenerate AI answer for a search query.
 * Logs the attempt for the feedback loop.
 */
export interface RegenerateResult {
  answer: string;
  safety?: SafetyInfo;
  groundedness?: GroundednessInfo;
  chart_data?: ChartDataItem[] | null;
}

export async function regenerateAnswer(
  sessionId: number
): Promise<RegenerateResult> {
  return apiCall<RegenerateResult>("/regenerate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId }),
  });
}

// Analytics types
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

/**
 * Get spending analytics: by merchant and by month.
 */
export async function getSpendingAnalytics(months: number = 6): Promise<SpendingAnalytics> {
  return apiCall<SpendingAnalytics>(`/analytics/spending?months=${months}`);
}

/**
 * Get detected recurring subscriptions and charges.
 */
export async function getRecurringCosts(): Promise<RecurringAnalytics> {
  return apiCall<RecurringAnalytics>("/analytics/recurring");
}

/**
 * Get detected travel trips grouped by date proximity.
 */
export async function getTrips(): Promise<TripAnalytics> {
  return apiCall<TripAnalytics>("/analytics/trips");
}
