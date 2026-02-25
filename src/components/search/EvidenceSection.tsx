import DocumentCard from "@/components/ui/DocumentCard";
import { type Document } from "@/lib/types";

interface EvidenceSectionProps {
  documents: Document[];
  onDocumentClick: (id: string) => void;
}

export default function EvidenceSection({ documents, onDocumentClick }: EvidenceSectionProps) {
  return (
    <section>
      <h2 className="text-display font-semibold text-fg-primary tracking-heading mb-1">
        Evidence Used
      </h2>

      {documents.length === 0 ? (
        <p className="text-fg-secondary mt-4">
          We couldn&apos;t find documents matching your search. Try different keywords?
        </p>
      ) : (
        <>
          <p className="text-sm text-fg-tertiary mb-4">
            {documents.length} document{documents.length !== 1 ? "s" : ""} referenced
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                {...doc}
                onClick={() => onDocumentClick(doc.id)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
