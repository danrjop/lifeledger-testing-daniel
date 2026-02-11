interface EmptyStateProps {
    onUpload: () => void;
}

export default function EmptyState({ onUpload }: EmptyStateProps) {
    return (
        <div className="flex h-full flex-col items-center justify-center">
            <button
                onClick={onUpload}
                className="group flex flex-col items-center gap-4 p-12 transition-all duration-200 ease-out motion-safe:hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent-light text-accent ring-1 ring-accent/20 group-hover:bg-accent/20 group-hover:ring-accent/30 transition-colors duration-200">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-10 w-10"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                        />
                    </svg>
                </div>
                <span className="text-xl font-medium text-fg-secondary group-hover:text-fg-primary transition-colors duration-200">
                    Upload Pictures
                </span>
            </button>
        </div>
    );
}
