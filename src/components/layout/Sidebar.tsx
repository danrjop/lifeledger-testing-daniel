interface SidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
    const menuItems = [
        { name: "Dashboard", id: "dashboard", icon: "🏠" },
        { name: "Browse", id: "browse", icon: "🔍" },
        { name: "Receipts", id: "receipts", icon: "🧾" },
        { name: "Subscriptions", id: "subscriptions", icon: "🔄" },
        { name: "Warranties", id: "warranties", icon: "🛡️" },
    ];

    return (
        <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-white min-h-screen p-4">
            <div className="mb-8 px-4 text-2xl font-bold text-gray-800">
                LifeLedger
            </div>
            <nav className="space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`w-full group flex items-center rounded-md px-4 py-3 text-base font-medium transition-colors ${activeTab === item.id
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            }`}
                    >
                        <span className="mr-3 text-xl">{item.icon}</span>
                        {item.name}
                    </button>
                ))}
            </nav>
        </aside>
    );
}
