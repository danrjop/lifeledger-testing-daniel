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
            case "Done": return "text-green-600 bg-green-50";
            case "Needs Review": return "text-amber-600 bg-amber-50";
            case "Processing": return "text-blue-600 bg-blue-50";
            default: return "text-gray-600 bg-gray-50";
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
            className="group relative flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-400 hover:shadow-md cursor-pointer"
        >
            {/* Image Preview */}
            <div className="relative h-32 w-full overflow-hidden rounded-lg bg-gray-100">
                <img
                    src={fileUrl}
                    alt={primaryEntity}
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-2 right-2 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {type}
                </span>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-1" title={primaryEntity}>
                            {primaryEntity}
                        </h3>
                        {secondaryEntity && (
                            <p className="text-xs text-gray-500 line-clamp-1">{secondaryEntity}</p>
                        )}
                    </div>
                    <span className="font-bold text-gray-900">{totalValue}</span>
                </div>

                <div className="mt-2 flex items-center justify-between text-xs">
                    <div className="flex flex-col">
                        <span className="text-gray-400">{getDateLabel()}</span>
                        <span className="font-medium text-gray-700">{primaryDate}</span>
                    </div>
                </div>
            </div>

            {/* Status Footer */}
            <div className={`mt-1 inline-flex w-fit items-center rounded-md px-2 py-1 text-xs font-medium ${getStatusColor(status)}`}>
                {status}
            </div>
        </div>
    );
}
