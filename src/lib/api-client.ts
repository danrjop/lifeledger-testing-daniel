/**
 * API client for LifeLedger backend.
 * Calls FastAPI backend directly with auth token from Cognito.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `API error: ${res.status}`);
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

export interface UploadAndProcessResponse {
  uploaded: UploadedDoc[];
  count: number;
  message: string;
}

export type DocumentType = "Receipt" | "Subscription" | "Invoice" | "Fine" | "Form";
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

export interface SearchResult {
  answer: string;
  documents: Document[];
  query: string;
}

export interface AskResponse {
  answer: string;
  sources: string[];
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
export async function searchDocuments(query: string): Promise<SearchResult> {
  return apiCall<SearchResult>("/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
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
