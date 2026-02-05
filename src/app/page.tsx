"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import DashboardView from "@/components/views/DashboardView";
import BrowseView from "@/components/views/BrowseView";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Map sidebar tabs to BrowseView filters
  const getBrowseFilter = () => {
    switch (activeTab) {
      case "receipts": return "Receipts";
      case "subscriptions": return "Subscriptions";
      case "browse": return "All";
      default: return "All";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex flex-1 flex-col min-w-0">
        <TopBar />

        <main className="flex-1 overflow-hidden">
          {activeTab === "dashboard" && <DashboardView />}

          {["browse", "receipts", "subscriptions"].includes(activeTab) && (
            <BrowseView key={activeTab} initialFilter={getBrowseFilter()} />
          )}

          {activeTab === "warranties" && (
            <div className="flex h-full items-center justify-center text-gray-400">
              Warranties Work in progress
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
