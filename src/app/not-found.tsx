"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const [sec, setSec] = useState(10);
    const router = useRouter();

    useEffect(() => {
        const t = setInterval(() => setSec(s => s - 1), 1000);
        const to = setTimeout(() => router.replace("/"), 10000);
        return () => { clearInterval(t); clearTimeout(to); };
    }, [router]);

    return (
        <div className="min-h-dvh grid place-items-center bg-[radial-gradient(1200px_600px_at_50%_-10%,#fff1bd_0%,transparent_60%),linear-gradient(#ffffff,#f5f5f5)]">
            <div className="w-[92%] max-w-lg rounded-3xl border bg-white/95 backdrop-blur p-8 shadow-2xl text-center">
                <div className="text-7xl font-black text-amber-500 tracking-tight">404</div>
                <h1 className="mt-2 text-2xl font-bold">Halaman tidak ditemukan</h1>
                <p className="mt-2 text-zinc-600">
                    Maaf, halaman yang Anda tuju tidak tersedia.
                </p>
                <p className="text-sm text-zinc-500 mt-1">
                    Mengalihkan ke beranda dalam <b>{sec}</b> detik…
                </p>

                <div className="mt-5 flex items-center justify-center gap-3">
                    <Link href="/" className="rounded-lg bg-amber-400 text-zinc-900 font-semibold px-4 py-2 hover:bg-amber-300">
                        Ke Beranda
                    </Link>
                    <button onClick={() => router.back()} className="rounded-lg border px-4 py-2 hover:bg-zinc-50">
                        Kembali
                    </button>
                </div>
            </div>
        </div>
    );
}
