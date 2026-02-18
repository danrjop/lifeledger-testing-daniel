"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import DashboardSidebar, { type FilterType } from "@/components/layout/DashboardSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import EventCard from "@/components/ui/EventCard";
import DocumentCard from "@/components/ui/DocumentCard";
import DocumentViewer from "@/components/ui/DocumentViewer";
import ReviewModal from "@/components/ui/ReviewModal";
import EmptyState from "@/components/views/EmptyState";
import { uploadAndProcess, getDocuments, deleteDocuments, getRadarEvents, reviewDocument, type Document, type RadarEvent } from "@/lib/api-client";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_PREFIXES = ["image/"];

export default function DashboardPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [radarEvents, setRadarEvents] = useState<RadarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Set<FilterType>>(new Set());
  const [viewerDocId, setViewerDocId] = useState<string | null>(null);
  const [reviewDocId, setReviewDocId] = useState<string | null>(null);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load documents and radar events on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [docs, radar] = await Promise.all([
          getDocuments(),
          getRadarEvents(30), // Next 30 days
        ]);
        setDocuments(docs);
        setRadarEvents(radar.events);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleFilterToggle = useCallback((filter: FilterType) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(filter)) {
        next.delete(filter);
      } else {
        next.add(filter);
      }
      return next;
    });
  }, []);

  const triggerUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const toggleSelectMode = useCallback(() => {
    setIsSelectMode((prev) => !prev);
    setSelectedIds(new Set()); // Clear selection when toggling
  }, []);

  const handleSelectDocument = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleDeleteSelected = useCallback(async () => {
    if (selectedIds.size === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.size} document(s)? This cannot be undone.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deleteDocuments(Array.from(selectedIds));
      // Remove deleted documents from state
      setDocuments((prev) => prev.filter((doc) => !selectedIds.has(doc.id)));
      setSelectedIds(new Set());
      setIsSelectMode(false);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete documents. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }, [selectedIds]);

  const handleReviewSubmit = useCallback(async (docId: string, note: string) => {
    await reviewDocument(docId, note);
    // Refresh documents to update status
    const docs = await getDocuments();
    setDocuments(docs);
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!ALLOWED_MIME_PREFIXES.some((prefix) => file.type.startsWith(prefix))) {
        alert(`"${file.name}" is not a valid image file. Please upload images only.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        alert(`"${file.name}" exceeds the 10MB size limit.`);
        continue;
      }

      validFiles.push(file);
    }

    e.target.value = "";
    if (validFiles.length === 0) return;

    setIsUploading(true);

    let uploadSucceeded = false;
    try {
      // Upload and process all files at once
      await uploadAndProcess(validFiles);
      uploadSucceeded = true;
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    }

    // Always refresh the document list and radar (even if upload failed, to show current state)
    try {
      const [docs, radar] = await Promise.all([
        getDocuments(),
        getRadarEvents(30),
      ]);
      setDocuments(docs);
      setRadarEvents(radar.events);
    } catch (error) {
      console.error("Failed to refresh documents:", error);
      if (uploadSucceeded) {
        // Upload worked but refresh failed - let user know to refresh manually
        alert("Documents uploaded but failed to refresh. Please reload the page.");
      }
    }

    // Poll for document and radar updates (5s interval, 6 polls = 30s total)
    // OCR and crawler run in background after upload
    if (uploadSucceeded) {
      let pollCount = 0;
      const pollInterval = setInterval(async () => {
        pollCount++;
        if (pollCount >= 12) {
          clearInterval(pollInterval);
          return;
        }
        try {
          const [docs, radar] = await Promise.all([
            getDocuments(),
            getRadarEvents(30),
          ]);
          setDocuments(docs);
          setRadarEvents(radar.events);
        } catch (e) {
          // Silently ignore polling errors
        }
      }, 5000);
    }

    setIsUploading(false);
  }, []);

  // Filter documents by active filter types
  const filteredDocuments = activeFilters.size === 0
    ? documents
    : documents.filter((doc) => activeFilters.has(doc.type as FilterType));

  const hasContent = documents.length > 0;

  return (
    <div className="flex h-full">
      <DashboardSidebar
        activeFilters={activeFilters}
        onFilterToggle={handleFilterToggle}
      />

      <div className="flex flex-1 flex-col min-w-0">
        <DashboardHeader onUploadClick={triggerUpload}>
          {/* Select/Delete Controls */}
          <div className="flex items-center gap-2">
            {isSelectMode && selectedIds.size > 0 && (
              <button
                onClick={handleDeleteSelected}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 transition-colors disabled:opacity-50"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
                Delete ({selectedIds.size})
              </button>
            )}
            <button
              onClick={toggleSelectMode}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isSelectMode
                  ? "bg-fg-secondary text-white"
                  : "bg-bg-tertiary text-fg-secondary hover:bg-bg-tertiary/80"
              }`}
            >
              {isSelectMode ? "Cancel" : "Select"}
            </button>
          </div>
        </DashboardHeader>

        <main className="flex-1 overflow-auto p-8">
          {/* Event Radar - Only show if there are upcoming events */}
          {radarEvents.length > 0 && (
            <section className="mb-8">
              <h2 className="text-display font-semibold text-fg-primary tracking-heading mb-4">
                Event Radar
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
                {radarEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setViewerDocId(event.id)}
                    className="flex-shrink-0 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded-2xl"
                  >
                    <EventCard
                      date={event.date}
                      title={event.primaryEntity}
                      docRef={event.id}
                    />
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Main Content Area */}
          <section>
            <h2 className="text-display font-semibold text-fg-primary tracking-heading mb-4">
              Documents
            </h2>

            {isLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-fg-secondary">Loading documents...</div>
              </div>
            ) : !hasContent ? (
              /* Empty State — large clickable upload box */
              <div className="rounded-2xl border-2 border-dashed border-bg-tertiary bg-bg-secondary/50 min-h-[400px] flex items-center justify-center">
                <EmptyState onUpload={triggerUpload} />
              </div>
            ) : (
              /* Document Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    {...doc}
                    onClick={() => {
                      if (doc.status === "Needs Review") {
                        setReviewDocId(doc.id);
                      } else {
                        setViewerDocId(doc.id);
                      }
                    }}
                    isSelectMode={isSelectMode}
                    isSelected={selectedIds.has(doc.id)}
                    onSelect={handleSelectDocument}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Upload Progress Indicator */}
          {isUploading && (
            <div className="fixed bottom-8 right-8 bg-bg-primary border border-bg-tertiary rounded-xl shadow-lg px-6 py-4 flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <span className="text-fg-primary font-medium">Uploading & processing...</span>
            </div>
          )}
        </main>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />

      {/* Document Viewer Modal */}
      {viewerDocId && (
        <DocumentViewer
          documentId={viewerDocId}
          onClose={() => setViewerDocId(null)}
          documents={documents}
        />
      )}

      {/* Review Modal for "Needs Review" documents */}
      {reviewDocId && (() => {
        const doc = documents.find(d => d.id === reviewDocId);
        return doc ? (
          <ReviewModal
            document={doc}
            onClose={() => setReviewDocId(null)}
            onSubmit={handleReviewSubmit}
          />
        ) : null;
      })()}
    </div>
  );
}
