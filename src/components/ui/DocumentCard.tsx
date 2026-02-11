import { Document } from "@/data/documents";

interface DocumentCardProps extends Document {
    onClick?: () => void;
}

export default function DocumentCard({
    type,
    primaryEntity,
    secondaryEntity,
    totalValue,
    primaryDate,
    status,
    fileUrl,
    onClick
}: DocumentCardProps) {

    // Status color mapping
    const getStatusColor = (s: string) => {
        switch (s) {
            case "Done": return "text-success bg-success/10";
            case "Needs Review": return "text-warning bg-warning/10";
            case "Processing": return "text-info bg-info/10";
            default: return "text-fg-secondary bg-bg-tertiary";
        }
    };

    // Label mapping based on type
    const getEntityLabel = () => {
        switch (type) {
            case "Receipt": return "Merchant";
            case "Subscription": return "Service";
            case "Fine": return "Authority";
            default: return "Entity";
        }
    };

    const getDateLabel = () => {
        switch (type) {
            case "Receipt": return "Date";
            case "Subscription": return "Billed";
            case "Fine": return "Date";
            default: return "Date";
        }
    };

    return (
        <div
            onClick={onClick}
            className="group relative flex flex-col gap-3 rounded-2xl border border-bg-tertiary/50 bg-bg-secondary p-6 transition-colors duration-200 hover:border-bg-tertiary cursor-pointer"
        >
            {/* Image Preview */}
            <div className="relative h-32 w-full overflow-hidden rounded-xl bg-bg-tertiary">
                <img
                    src={fileUrl}
                    alt={primaryEntity}
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-2 right-2 rounded-md bg-fg-primary/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {type}
                </span>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-fg-primary line-clamp-1" title={primaryEntity}>
                            {primaryEntity}
                        </h3>
                        {secondaryEntity && (
                            <p className="text-xs text-fg-secondary line-clamp-1">{secondaryEntity}</p>
                        )}
                    </div>
                    <span className="font-semibold text-fg-primary tabular-nums">{totalValue}</span>
                </div>

                <div className="mt-2 flex items-center justify-between text-xs">
                    <div className="flex flex-col">
                        <span className="text-fg-tertiary">{getDateLabel()}</span>
                        <span className="font-medium text-fg-secondary">{primaryDate}</span>
                    </div>
                </div>
            </div>

            {/* Status Footer */}
            <div className={`mt-1 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(status)}`}>
                {status}
            </div>
        </div>
    );
}
