// src/components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { X } from "lucide-react";
import { useUI } from "@/state/ui-store";

const items = [
    { href: "/admin", label: "Home" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/roles", label: "Roles" },
    { href: "/admin/trainings", label: "Trainings" },
];

const isActive = (pathname: string, href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(href + "/");
};

export default function AdminSidebar() {
    const pathname = usePathname();
    const { sidebarOpen: open, closeSidebar, setSidebar } = useUI();

    // Tutup saat route berubah
    useEffect(() => { setSidebar(false); }, [pathname, setSidebar]);

    // Lock scroll saat drawer open
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prev; };
    }, [open]);

    const drawerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (!open) return;
        const drawer = drawerRef.current;
        drawer?.focus();

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") return closeSidebar();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, closeSidebar]);

    const nav = useMemo(
        () => items.map(it => {
            const active = isActive(pathname, it.href);
            return (
                <Link
                    key={it.href}
                    href={it.href}
                    className={`block rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400
            ${active ? "bg-amber-50 text-amber-700 font-medium" : "hover:bg-zinc-50"}`}
                >
                    {it.label}
                </Link>
            );
        }),
        [pathname]
    );

    return (
        <>
            <div
                onClick={closeSidebar}
                className={`fixed inset-0 z-[60] bg-black/40 transition-opacity lg:hidden
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                aria-hidden={!open}
            />
            <aside
                ref={drawerRef}
                className={`fixed z-[61] top-0 left-0 h-dvh w-64 bg-white border-r shadow-lg lg:hidden
          transform transition-transform duration-300 outline-none
          ${open ? "translate-x-0" : "-translate-x-full"}`}
                role="dialog" aria-modal="true" tabIndex={-1}
            >
                <div className="h-14 flex items-center justify-between px-3 border-b">
                    <span className="font-semibold">Menu</span>
                    <button onClick={closeSidebar} className="p-2 rounded-md hover:bg-zinc-100" aria-label="Tutup menu">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <nav className="p-3 space-y-1">{nav}</nav>
            </aside>

            <aside className="w-60 shrink-0 border-r bg-white hidden lg:block">
                <div className="h-14 flex items-center px-3 border-b font-semibold">Menu</div>
                <nav className="p-3 space-y-1">{nav}</nav>
            </aside>
        </>
    );
}
