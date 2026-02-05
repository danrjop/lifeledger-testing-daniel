interface EventCardProps {
    date: string;
    title: string;
    docRef: string;
}

export default function EventCard({ date, title, docRef }: EventCardProps) {
    // Parse date for nicer display (e.g., "FEB 12")
    const dateObj = new Date(date);
    const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const day = dateObj.toLocaleString('en-US', { day: 'numeric' });

    return (
        <div className="group relative flex w-60 flex-shrink-0 flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:-translate-y-1 hover:shadow-md">
            {/* Semantic Accent Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>

            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    {/* Date Badge */}
                    <div className="flex flex-col items-center rounded-lg border border-gray-100 bg-gray-50 px-2 py-1.5 text-center shadow-sm">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{month}</span>
                        <span className="text-xl font-bold leading-none text-gray-900">{day}</span>
                    </div>

                    {/* Icon / Action Hint */}
                    <div className="rounded-full bg-gray-50 p-1.5 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                    </div>
                </div>

                <div className="mt-4">
                    <h3 className="text-base font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                        {title}
                    </h3>
                    <p className="mt-2 text-xs font-medium text-gray-400 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z" clipRule="evenodd" />
                        </svg>
                        Linked Document
                    </p>
                </div>
            </div>
        </div>
    );
}
