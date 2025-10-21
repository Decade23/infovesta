// src/components/admin/AdminHeader.tsx
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { useUI } from "@/state/ui-store";

export default function AdminHeader() {
    const { openSidebar } = useUI();
    const [confirm, setConfirm] = useState(false);
    const router = useRouter();

    return (
        <header className="z-[70] h-14 border-b bg-white/90 backdrop-blur flex items-center px-4 justify-between">
            <button onClick={openSidebar} className="lg:hidden p-2" aria-label="Buka menu">
                <Menu className="w-5 h-5" />
            </button>

            <Link href="/admin" className="font-semibold">{process.env.NEXT_PUBLIC_TITLE}</Link>

            <button onClick={() => setConfirm(true)} className="inline-flex cursor-pointer hover:opacity-50 items-center gap-1 text-sm">
                <LogOut className="w-4 h-4" /> Logout
            </button>

            <Modal
                open={confirm}
                title="Keluar dari Console?"
                onClose={() => setConfirm(false)}
                actions={
                    <>
                        <button onClick={() => setConfirm(false)} className="rounded-lg cursor-pointer border px-4 py-2 hover:bg-zinc-100">Batal</button>
                        <button onClick={() => router.push("/logout")} className="rounded-lg cursor-pointer bg-amber-400 text-zinc-900 font-semibold px-4 py-2 hover:bg-amber-300">Keluar</button>
                    </>
                }
            >
                <p className="text-sm">Anda yakin ingin keluar? Sesi akan diakhiri dan perlu login ulang.</p>
            </Modal>
        </header>
    );
}
