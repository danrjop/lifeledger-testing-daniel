"use client";

import Link from "next/link";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function DashboardSidebar() {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <aside className="flex w-60 flex-col border-r border-gray-200 bg-white">
      <div className="px-6 py-5 text-lg font-bold text-gray-900">
        LifeLedger
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        <Link
          href="/dashboard"
          className="rounded px-3 py-2 text-gray-700 hover:bg-gray-100"
        >
          Dashboard
        </Link>
      </nav>
      <div className="border-t border-gray-200 p-3">
        <button
          onClick={handleLogout}
          className="w-full rounded px-3 py-2 text-left text-gray-600 hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
