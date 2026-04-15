/**
 * Frontend-only mock API client for the LifeLedger demo.
 *
 * NO network calls — every function returns canned data from `demo-data.ts`
 * and `canned-queries.ts`. User uploads live in sessionStorage as base64
 * data URLs and disappear when the tab is closed.
 */

import {
  DEMO_DOCUMENTS,
  DEMO_RADAR,
  DEMO_SPENDING,
  DEMO_RECURRING,
  DEMO_TRIPS,
  DEMO_INCOME,
  getDemoDocumentDetail,
  getDemoRelated,
} from "./demo-data";
import { CANNED_QUERIES, CANNED_BY_QUERY, REGENERATE_VARIANTS } from "./canned-queries";

import type {
  ApiError,
  Document,
  DocumentDetail,
  RadarResponse,
  RelatedDocument,
  SearchResult,
  AskResponse,
  DeleteResponse,
  RegenerateResult,
  SpendingAnalytics,
  RecurringAnalytics,
  TripAnalytics,
  IncomeAnalytics,
  UploadAndProcessResponse,
} from "./api-client-types";

// Re-export every type so existing imports (`from "@/lib/api-client"`) keep working.
export type * from "./api-client-types";

// Token getter shim — auth-context still calls this; we just no-op.
export function setTokenGetter(_getter: () => Promise<string | null>) {
  // intentionally empty — no backend to authenticate against
}

// ── Simulated latency for realism ──────────────────────────────────
const LATENCY_MS = 350;
const wait = <T>(value: T, ms = LATENCY_MS) =>
  new Promise<T>((res) => setTimeout(() => res(value), ms));

// ── User uploads (session-only, in-memory + sessionStorage) ────────
const UPLOAD_KEY = "lifeledger_demo_uploads_v1";
let userUploads: Document[] = loadUploads();

function loadUploads(): Document[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(UPLOAD_KEY);
    return raw ? (JSON.parse(raw) as Document[]) : [];
  } catch {
    return [];
  }
}

function persistUploads() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(UPLOAD_KEY, JSON.stringify(userUploads));
  } catch {
    // sessionStorage may be full from large images — drop oldest if so
    while (userUploads.length > 0) {
      userUploads.shift();
      try {
        window.sessionStorage.setItem(UPLOAD_KEY, JSON.stringify(userUploads));
        break;
      } catch {
        /* keep dropping */
      }
    }
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function classifyByFilename(name: string): Document["type"] {
  const lower = name.toLowerCase();
  if (/(receipt|grocer|coffee|food|order)/.test(lower)) return "Receipt";
  if (/(invoice|bill)/.test(lower)) return "Invoice";
  if (/(payslip|paystub|paycheck)/.test(lower)) return "Payslip";
  if (/(lease|rent)/.test(lower)) return "Rental Agreement";
  if (/(subscription|netflix|spotify)/.test(lower)) return "Subscription";
  if (/(fine|ticket|citation|parking)/.test(lower)) return "Fine";
  if (/(insurance|policy|form)/.test(lower)) return "Form";
  return "Other";
}

// ── Endpoints ──────────────────────────────────────────────────────

export async function uploadAndProcess(
  files: File[]
): Promise<UploadAndProcessResponse> {
  const accepted = files.filter((f) => f.size <= 10 * 1024 * 1024 && f.type.startsWith("image/"));
  const rejected = files
    .filter((f) => !accepted.includes(f))
    .map((f) => ({
      filename: f.name,
      message: f.size > 10 * 1024 * 1024 ? "Exceeds 10MB" : "Not a supported image",
    }));

  // Convert each accepted file to a data URL + synthesize a Document record
  const uploaded = await Promise.all(
    accepted.map(async (file, i) => {
      const dataUrl = await fileToDataUrl(file);
      const id = `u-${Date.now()}-${i}`;
      const today = new Date().toISOString().split("T")[0];
      const doc: Document = {
        id,
        type: classifyByFilename(file.name),
        fileUrl: dataUrl,
        status: "Done",
        primaryEntity: file.name.replace(/\.[^.]+$/, ""),
        primaryDate: today,
        totalValue: "—",
        radarProcessed: true,
        metadata: { Source: "Uploaded this session" },
      };
      userUploads.unshift(doc);
      return {
        doc_id: i,
        s3_key: id,
        filename: file.name,
        status: "uploaded",
      };
    })
  );

  persistUploads();

  return wait({
    uploaded,
    count: uploaded.length,
    message: `Uploaded ${uploaded.length} file(s) for this session.`,
    rejected: rejected.length > 0 ? rejected : undefined,
  });
}

export async function getDocuments(): Promise<Document[]> {
  // Re-read from sessionStorage in case another tab/route added something
  userUploads = loadUploads();
  return wait([...userUploads, ...DEMO_DOCUMENTS]);
}

export async function getDocument(docId: string): Promise<DocumentDetail> {
  const upload = userUploads.find((d) => d.id === docId);
  if (upload) {
    return wait({ ...upload, ocr_blocks: [], doc_text: "Uploaded image (no OCR in demo)." });
  }
  const detail = getDemoDocumentDetail(docId);
  if (!detail) {
    const err = new Error("Document not found") as ApiError;
    err.status = 404;
    throw err;
  }
  return wait(detail);
}

export async function getRelatedDocuments(
  docId: string,
  limit = 4
): Promise<RelatedDocument[]> {
  return wait(getDemoRelated(docId, limit));
}

export async function deleteDocuments(documentIds: string[]): Promise<DeleteResponse> {
  // Only allow deleting user-uploaded docs (seed docs persist across the demo)
  const before = userUploads.length;
  userUploads = userUploads.filter((d) => !documentIds.includes(d.id));
  persistUploads();
  return wait({
    deleted_count: before - userUploads.length,
    s3_deleted: 0,
    s3_errors: 0,
    message: "Deleted",
  });
}

export async function reviewDocument(_docId: string, _note: string): Promise<void> {
  // No-op in the demo
  return wait(undefined);
}

export async function getRadarEvents(_days = 30): Promise<RadarResponse> {
  return wait({ events: DEMO_RADAR, count: DEMO_RADAR.length });
}

// ── Search / Ask / Regenerate ──────────────────────────────────────

let conversationCounter = 1000;
let sessionCounter = 5000;

export async function searchDocuments(
  query: string,
  conversationId?: number
): Promise<SearchResult> {
  const key = query.toLowerCase().trim();
  const canned = CANNED_BY_QUERY[key]
    // Loose match — last canned with overlapping keywords
    ?? CANNED_QUERIES.find((q) => key && q.query.toLowerCase().includes(key));

  const session_id = ++sessionCounter;
  const conversation_id = conversationId ?? ++conversationCounter;

  if (canned) {
    return wait({
      ...canned.result,
      query,
      session_id,
      conversation_id,
    } as SearchResult);
  }

  // Fallback for free-typed queries (or follow-ups not in catalog)
  return wait<SearchResult>({
    query,
    session_id,
    conversation_id,
    answer:
      "I couldn't find a great match for that exact phrasing in this demo. Try one of the suggested questions below — they showcase the agent's full capability set.",
    documents: [],
    chart_data: null,
    safety: null,
    groundedness: null,
    followUps: CANNED_QUERIES.slice(0, 4).map((q) => q.query),
  });
}

export async function askAgent(question: string): Promise<AskResponse> {
  const result = await searchDocuments(question);
  return {
    answer: result.answer,
    sources: result.documents.map((d) => d.id),
  };
}

export async function regenerateAnswer(sessionId: number): Promise<RegenerateResult> {
  // Find the canned entry by sessionId — but we don't track that, so cycle by chance
  const canned =
    CANNED_QUERIES.find((q) => REGENERATE_VARIANTS[q.id]) ?? CANNED_QUERIES[0];
  const variants = REGENERATE_VARIANTS[canned.id] ?? [canned.result.answer];
  const idx = sessionId % variants.length;
  return wait<RegenerateResult>({
    answer: variants[idx],
    chart_data: canned.result.chart_data ?? null,
    safety: canned.result.safety ?? undefined,
    groundedness: canned.result.groundedness ?? undefined,
  });
}

// ── Analytics ──────────────────────────────────────────────────────

export async function getSpendingAnalytics(_months = 6): Promise<SpendingAnalytics> {
  return wait(DEMO_SPENDING);
}

export async function getRecurringCosts(): Promise<RecurringAnalytics> {
  return wait(DEMO_RECURRING);
}

export async function getTrips(): Promise<TripAnalytics> {
  return wait(DEMO_TRIPS);
}

export async function getIncomeAnalytics(_months = 6): Promise<IncomeAnalytics> {
  return wait(DEMO_INCOME);
}
