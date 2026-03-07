"use client";

import { useState, useEffect } from "react";
import { CourseSidebar } from "@/app/components/course-sidebar";
import { SupportPanel } from "@/app/components/support-panel";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [supportPanelOpen, setSupportPanelOpen] = useState(false);

  useEffect(() => {
    const handler = () => setSupportPanelOpen(true);
    document.addEventListener("openSupport", handler);
    return () => document.removeEventListener("openSupport", handler);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Sidebar */}
      <CourseSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Support - Collapsible */}
      <SupportPanel
        isOpen={supportPanelOpen}
        onToggle={() => setSupportPanelOpen(!supportPanelOpen)}
      />
    </div>
  );
}
