export interface LineItem {
    description: string;
    qty?: number | string;
    unitPrice?: number | string;
    amount: number | string;
}

export interface DocumentMetadata {
    [key: string]: string | number | undefined;
}

export interface Document {
    id: string;
    type: "Receipt" | "Subscription" | "Invoice" | "Fine" | "Form" | "Other"; // Normalized types
    fileUrl: string;
    status: "Processing" | "Needs Review" | "Done";

    // Normalized Fields
    primaryEntity: string;      // e.g. Merchant, Service Name, Issuer
    secondaryEntity?: string;   // e.g. Branch, Location
    primaryDate: string;        // e.g. Billing Date, Transaction Date
    secondaryDate?: string;     // e.g. Renewal Date
    totalValue: string;         // formatted string e.g. "$120.00"

    lineItems?: LineItem[];
    metadata?: DocumentMetadata;
}
