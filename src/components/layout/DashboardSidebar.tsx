"use client";

import Link from "next/link";
import { signOutAction } from "@/lib/auth-actions";
import { useRouter, usePathname } from "next/navigation";

export type FilterType = "Receipt" | "Subscription" | "Form" | "Other";

const FILTERS: { type: FilterType; label: string }[] = [
  { type: "Receipt", label: "Receipts" },
  { type: "Subscription", label: "Subscriptions" },
  { type: "Form", label: "Forms" },
  { type: "Other", label: "Other" },
];

interface DashboardSidebarProps {
  activeFilters: Set<FilterType>;
  onFilterToggle: (filter: FilterType) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function DashboardSidebar({ activeFilters, onFilterToggle, isOpen = false, onClose }: DashboardSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOutAction();
    router.push("/");
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-60 flex-col border-r border-bg-tertiary/50 bg-bg-secondary
        transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:flex
        ${isOpen ? 'translate-x-0 flex' : '-translate-x-full hidden md:flex'}
      `}>
      {/* Logo */}
      <div className="px-6 py-5 text-lg font-semibold text-fg-primary tracking-tight">
        LifeLedger
      </div>

      <nav className="flex flex-col gap-1 px-3">
        <Link
          href="/dashboard"
          className={`flex items-center gap-2 rounded-xl px-3 py-2 transition-colors duration-200 ${
            isActive("/dashboard")
              ? "bg-accent-light text-accent font-medium"
              : "text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          Dashboard
        </Link>
      </nav>

      {/* Filters */}
      <div className="mt-6 px-3">
        <h3 className="px-3 mb-2 text-xs font-bold text-fg-tertiary uppercase tracking-wider">
          Filters
        </h3>
        <div className="flex flex-col gap-1">
          {FILTERS.map(({ type, label }) => {
            const isFilterActive = activeFilters.has(type);
            return (
              <button
                key={type}
                onClick={() => onFilterToggle(type)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors duration-200 min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  isFilterActive
                    ? "bg-accent-light text-accent font-medium"
                    : "text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary"
                }`}
              >
                {/* Checkbox indicator */}
                <span
                  className={`flex items-center justify-center w-4 h-4 rounded border transition-colors duration-200 ${
                    isFilterActive
                      ? "bg-accent border-accent"
                      : "border-fg-tertiary"
                  }`}
                >
                  {isFilterActive && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 text-accent-fg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  )}
                </span>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Logout */}
      <div className="border-t border-bg-tertiary/50 p-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-left text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary transition-colors duration-200 min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
    </>
  );
}
