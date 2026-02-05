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
    type: "Receipt" | "Subscription" | "Invoice" | "Fine"; // Normalized types
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

// Helper to get date string relative to today
const getRelativeDate = (daysOffset: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
};

export const documents: Document[] = [
    // --- SROIE RECEIPTS (Recent Past) ---
    {
        id: "doc_receipt_1",
        type: "Receipt",
        fileUrl: "/documents/receipt1.jpg",
        status: "Done",
        primaryEntity: "PERNIAGAAN ZHENG HUI",
        secondaryEntity: "JOHOR BAHRU",
        primaryDate: getRelativeDate(-2), // 2 days ago
        totalValue: "112.45",
        lineItems: [
            { description: '11" PROWESS H/DUTY SILICONE GUN G-D2', qty: 1, unitPrice: "15.00", amount: "15.00" },
            { description: 'XTRASEAL RTV ACETIC SILICONE SA-107', qty: 3, unitPrice: "7.00", amount: "21.00" },
            { description: 'CENTRAL PUNCH SET 3PCS', qty: 1, unitPrice: "18.00", amount: "18.00" },
            { description: '24" MARKSMAN PIPE WRENCH', qty: 1, unitPrice: "50.00", amount: "50.00" },
            { description: 'PVC WIRE TAPE 1PC X 7YD', qty: 3, unitPrice: "0.70", amount: "2.10" }
        ],
        metadata: {
            "GST No": "000800589824",
            "Receipt No": "CS00082662"
        }
    },
    {
        id: "doc_receipt_2",
        type: "Receipt",
        fileUrl: "/documents/receipt2.jpg",
        status: "Done",
        primaryEntity: "MCDONALD'S",
        secondaryEntity: "TAMAN MELAWATI",
        primaryDate: getRelativeDate(-5), // 5 days ago
        totalValue: "26.60",
        lineItems: [
            { description: "2 CHICMCMUFFIN", qty: 2, amount: "11.00" },
            { description: "1 M PORRIDGE", qty: 1, amount: "5.60" },
            { description: "1 BM 2HOTCAKES", qty: 1, amount: "10.00" }
        ],
        metadata: {
            "GST ID": "000504664064",
            "Order No": "50"
        }
    },
    {
        id: "doc_receipt_3",
        type: "Receipt",
        fileUrl: "/documents/receipt3.jpg",
        status: "Done",
        primaryEntity: "SAM SAM TRADING CO",
        secondaryEntity: "SHAH ALAM",
        primaryDate: getRelativeDate(-1), // Yesterday
        totalValue: "14.10",
        lineItems: [
            { description: "HE EOG UNICORN TWIN SUPER GLUE", qty: 1, unitPrice: "5.20", amount: "5.20" },
            { description: "SS EZL A4 CYBER MIX COLOR PAPER", qty: 1, unitPrice: "8.90", amount: "8.90" }
        ],
        metadata: {
            "GST No": "001006288896",
            "Invoice No": "R000721136"
        }
    },
    {
        id: "doc_receipt_4",
        type: "Receipt",
        fileUrl: "/documents/receipt4.jpg",
        status: "Done",
        primaryEntity: "ASIA MART",
        secondaryEntity: "KLANG, SELANGOR",
        primaryDate: getRelativeDate(-3), // 3 days ago
        totalValue: "32.70",
        lineItems: [
            { description: "S LIME 50G", qty: 17, unitPrice: "0.85", amount: "15.25" },
            { description: "DELICIA CHOCOLATE [50G]", qty: 1, unitPrice: "3.55", amount: "3.55" },
            { description: "GARDENIA ORIGINAL CLASSIC JUMBO [600G]", qty: 1, unitPrice: "1.41", amount: "1.50" },
            // ... truncated for brevity given the long list
        ],
        metadata: {
            "GST ID": "001609584640",
            "Doc No": "CS02070163"
        }
    },
    {
        id: "doc_receipt_5",
        type: "Receipt",
        fileUrl: "/documents/receipt5.jpg",
        status: "Done",
        primaryEntity: "LIGHTROOM GALLERY SDN BHD",
        secondaryEntity: "BANDAR BUKIT RAJA",
        primaryDate: getRelativeDate(-7), // 1 week ago
        totalValue: "73.00",
        lineItems: [
            { description: "T5 JOINT 2PIN 2PCS", qty: 1, unitPrice: "2.83", amount: "2.83" },
            { description: "YE30 BK 7W WW LED TRACK LIGHT", qty: 2, unitPrice: "33.02", amount: "66.04" }
        ],
        metadata: {
            "GST No": "000584089600",
            "Bill No": "LCS03908"
        }
    },

    // --- SUBSCRIPTIONS (Recent Date + Future Renewal) ---
    {
        id: "doc_sub_adobe",
        type: "Subscription",
        primaryEntity: "Adobe Creative Cloud",
        secondaryEntity: "Photography Plan",
        primaryDate: getRelativeDate(-10),    // Last billed 10 days ago
        secondaryDate: getRelativeDate(20),   // Renews in 20 days
        totalValue: "$19.99",
        status: "Done",
        fileUrl: "/documents/adobe.png",
        metadata: {
            "Plan Type": "Individual",
            "Payment Method": "Visa **** 1234"
        }
    },
    {
        id: "doc_sub_azure",
        type: "Subscription",
        primaryEntity: "Microsoft Azure",
        secondaryEntity: "Pay-As-You-Go",
        primaryDate: getRelativeDate(-25),    // Last billed 25 days ago
        secondaryDate: getRelativeDate(5),    // Renews in 5 days
        totalValue: "$45.32",
        status: "Done",
        fileUrl: "/documents/azure.png",
        metadata: {
            "Subscription ID": "sub-8892-x99",
            "Region": "US East"
        }
    },

    // --- FINE / TICKET (Recent Past) ---
    {
        id: "doc_ticket_rome",
        type: "Fine",
        primaryEntity: "Comune di Roma",
        secondaryEntity: "Polizia Locale",
        primaryDate: getRelativeDate(-14), // 2 weeks ago
        totalValue: "€105.00",
        status: "Needs Review",
        fileUrl: "/documents/ticket.jpg",
        metadata: {
            "Infraction": "Speeding (Excess < 10km/h)",
            "Location": "Via Appia Nuova",
            "Plate": "AB 123 CD"
        }
    }
];
