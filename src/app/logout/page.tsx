"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default function LogoutPage() {
    const [sec, setSec] = useState(3); // hitung mundur singkat
    const router = useRouter();

    useEffect(() => {
        // panggil API logout
        fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
        // countdown => menuju /login
        const t = setInterval(() => setSec(s => s - 1), 1000);
        const to = setTimeout(() => router.replace("/login"), 3000);
        return () => { clearInterval(t); clearTimeout(to); };
    }, [router]);

    return (
        <div className="min-h-dvh grid place-items-center bg-gradient-to-b from-white to-zinc-100">
            <div className="w-[92%] max-w-md rounded-2xl border bg-white p-6 shadow-xl text-center">
                <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <LogOut className="text-amber-600" />
                </div>
                <h1 className="text-xl font-bold">Keluar</h1>
                <p className="text-zinc-600 mt-1">Sesi Anda telah diakhiri.</p>
                <p className="text-sm text-zinc-500 mt-4">
                    Mengalihkan ke halaman login dalam <b>{sec}</b> detik…
                </p>
                <div className="mt-4">
                    <Link href="/login" className="text-amber-600 hover:underline">Ke halaman login sekarang</Link>
                </div>
            </div>
        </div>
    );
}
