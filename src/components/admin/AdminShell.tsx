// src/components/admin/AdminShell.tsx
"use client";

import React from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import SessionWatcher from "@/components/session/SessionWatcher";

export default function AdminShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-dvh flex flex-col">
            <AdminHeader />
            <div className="flex flex-1">
                <AdminSidebar />
                <main className="flex-1 min-w-0 bg-zinc-50 p-4 lg:p-6">
                    <SessionWatcher />
                    {children}
                </main>
            </div>
        </div>
    );
}
