"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
    const [sec, setSec] = useState(10);
    const router = useRouter();

    useEffect(() => {
        console.error(error);
        const t = setInterval(() => setSec(s => s - 1), 1000);
        const to = setTimeout(() => router.replace("/"), 10000);
        return () => { clearInterval(t); clearTimeout(to); };
    }, [error, router]);

    return (
        <html>
        <body className="min-h-dvh grid place-items-center bg-[radial-gradient(1200px_600px_at_50%_-10%,#fff1bd_0%,transparent_60%),linear-gradient(#ffffff,#f5f5f5)]">
        <div className="w-[92%] max-w-lg rounded-3xl border bg-white/95 backdrop-blur p-8 shadow-2xl text-center">
            <div className="text-2xl font-bold">Terjadi kesalahan</div>
            <p className="text-zinc-600 mt-2">Mohon maaf, terjadi error pada aplikasi.</p>
            <p className="text-sm text-zinc-500 mt-1">Redirect ke beranda dalam <b>{sec}</b> detik…</p>

            <div className="mt-5 flex items-center justify-center gap-3">
                <button onClick={() => reset()} className="rounded-lg bg-amber-400 text-zinc-900 font-semibold px-4 py-2 hover:bg-amber-300">
                    Coba Lagi
                </button>
                <Link href="/" className="rounded-lg border px-4 py-2 hover:bg-zinc-50">Ke Beranda</Link>
            </div>

            {/* detail kecil (opsional) */}
            {process.env.NODE_ENV === "development" && (
                <pre className="text-left text-xs text-zinc-600 bg-zinc-50 border rounded-lg p-3 mt-6 overflow-auto max-h-48">
{String(error?.message || "Error")}
            </pre>
            )}
        </div>
        </body>
        </html>
    );
}
