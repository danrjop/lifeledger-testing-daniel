"use client";

import Link from "next/link";
import { logout } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="flex w-60 flex-col border-r border-bg-tertiary/50 bg-bg-secondary">
      <div className="px-6 py-5 text-lg font-semibold text-fg-primary tracking-tight">
        LifeLedger
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        <Link
          href="/dashboard"
          className={`rounded-xl px-3 py-2 transition-colors duration-200 ${
            isActive("/dashboard")
              ? "bg-accent-light text-accent font-medium"
              : "text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary"
          }`}
        >
          Dashboard
        </Link>
      </nav>
      <div className="border-t border-bg-tertiary/50 p-3">
        <button
          onClick={handleLogout}
          className="w-full rounded-xl px-3 py-2 text-left text-fg-secondary hover:bg-bg-tertiary hover:text-fg-primary transition-colors duration-200 min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
