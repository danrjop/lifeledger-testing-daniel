import { Document } from "@/data/documents";

interface DocumentCardProps extends Document {
    onClick?: () => void;
    isSelectMode?: boolean;
    isSelected?: boolean;
    onSelect?: (id: string) => void;
}

export default function DocumentCard({
    id,
    type,
    primaryEntity,
    secondaryEntity,
    totalValue,
    primaryDate,
    status,
    fileUrl,
    onClick,
    isSelectMode = false,
    isSelected = false,
    onSelect,
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

    const handleClick = () => {
        if (isSelectMode && onSelect) {
            onSelect(id);
        } else if (onClick) {
            onClick();
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`group relative flex flex-col gap-3 rounded-2xl border bg-bg-secondary p-6 transition-colors duration-200 cursor-pointer ${
                isSelected
                    ? "border-accent ring-2 ring-accent/30"
                    : "border-bg-tertiary/50 hover:border-bg-tertiary"
            }`}
        >
            {/* Selection Checkbox */}
            {isSelectMode && (
                <div className="absolute top-3 left-3 z-10">
                    <div
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                            isSelected
                                ? "bg-accent border-accent"
                                : "bg-bg-primary/80 border-bg-tertiary hover:border-fg-secondary"
                        }`}
                    >
                        {isSelected && (
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                </div>
            )}

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
