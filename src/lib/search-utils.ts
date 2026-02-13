/**
 * Temporary search utilities — will be replaced by agentic router backend.
 */

import { type Document } from "@/data/documents";

export function searchDocuments(query: string, docs: Document[]): Document[] {
  if (!query.trim()) return [];

  const terms = query.toLowerCase().split(/\s+/);

  const scored = docs.map((doc) => {
    let score = 0;
    const searchable = [
      doc.primaryEntity,
      doc.secondaryEntity || "",
      doc.type,
      doc.totalValue,
      doc.primaryDate,
      ...Object.values(doc.metadata || {}),
    ]
      .join(" ")
      .toLowerCase();

    for (const term of terms) {
      if (searchable.includes(term)) score++;
      if (doc.primaryEntity.toLowerCase().includes(term)) score += 2;
      if (doc.type.toLowerCase() === term) score += 3;
    }

    return { doc, score };
  });

  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ doc }) => doc);
}

export function getMockAnswer(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("receipt") || q.includes("spent") || q.includes("grocery")) {
    return "Based on your recent receipts, you spent a total of $258.85 across 5 transactions. Your largest purchase was $112.45 at Perniagaan Zheng Hui for hardware supplies, and your most recent was $14.10 at Sam Sam Trading Co.";
  }

  if (q.includes("subscription") || q.includes("adobe") || q.includes("azure")) {
    return "You have 2 active subscriptions. Adobe Creative Cloud (Photography Plan) is $19.99/month, and Microsoft Azure (Pay-As-You-Go) is $45.32/month. Azure renews in 5 days.";
  }

  if (q.includes("fine") || q.includes("ticket")) {
    return "You have 1 outstanding fine from Comune di Roma for \u20AC105.00, issued for a speeding infraction on Via Appia Nuova. It currently needs review.";
  }

  if (q.includes("tax") || q.includes("w-2") || q.includes("form")) {
    return "I found your IRS W-2 Wage Statement for Tax Year 2025 showing total wages of $62,400.00 from Acme Corp. I also found a Health Insurance Enrollment form for Open Enrollment 2026 at $385.00/month.";
  }

  return "I found several documents that may be relevant to your search. The most relevant results are shown below, ordered by how closely they match your query.";
}
