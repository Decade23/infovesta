"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";

type SessionInfo = { authenticated: boolean; canRefresh: boolean; expiresAt: string | null };

const WARN_BEFORE_MS = Number(process.env.NEXT_PUBLIC_SESSION_WARN_BEFORE_MS ?? 180000); // 3 menit

export default function SessionWatcher() {

    const [info, setInfo] = useState<SessionInfo | null>(null);
    const [open, setOpen] = useState(false);
    const [remain, setRemain] = useState<number | null>(null);
    const timerRef = useRef<number | null>(null);
    const router = useRouter();

    const expiresAt = useMemo(() => info?.expiresAt ? new Date(info.expiresAt).getTime() : null, [info]);

    // polling ringan tiap 60 detik untuk sync (server baca cookie httpOnly)
    useEffect(() => {
        let alive = true;
        const fetchSession = async () => {
            try {
                const r = await fetch("/api/auth/session", { cache: "no-store" });
                const j = await r.json() as SessionInfo;
                if (alive) setInfo(j);
            } catch { /* ignore */ }
        };
        fetchSession();
        const id = setInterval(fetchSession, 60_000);
        return () => { alive = false; clearInterval(id); };
    }, []);

    // schedule warning modal
    useEffect(() => {
        if (!expiresAt) return;
        const now = Date.now();
        const msLeft = expiresAt - now;
        setRemain(msLeft);

        // buka modal jika sudah masuk window WARNING
        if (msLeft <= WARN_BEFORE_MS && msLeft > 0) setOpen(true);

        // tick per detik untuk update hitung mundur
        if (timerRef.current) window.clearInterval(timerRef.current);
        timerRef.current = window.setInterval(() => {
            const left = expiresAt - Date.now();
            setRemain(left);
            if (left <= 0) {
                window.clearInterval(timerRef.current!);
                setOpen(false);
                router.replace("/logout");
            }
            if (left <= WARN_BEFORE_MS) setOpen(true);
        }, 1000) as unknown as number;

        return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
    }, [expiresAt, router]);

    const onExtend = async () => {
        try {
            const r = await fetch("/api/auth/refresh", { method: "POST" });
            if (r.ok) {
                // refresh data session agar expiresAt baru
                const s = await fetch("/api/auth/session", { cache: "no-store" }).then(r => r.json()) as SessionInfo;
                setInfo(s);
                setOpen(false);
            } else {
                setOpen(false);
                router.replace("/logout");
            }
        } catch {
            setOpen(false);
            router.replace("/logout");
        }
    };

    const mmss = (ms: number) => {
        const s = Math.max(0, Math.floor(ms / 1000));
        const m = Math.floor(s / 60);
        const r = s % 60;
        return `${String(m).padStart(2,"0")}:${String(r).padStart(2,"0")}`;
    };

    if (!info?.authenticated || !expiresAt) return null;
    return (
        <Modal
            open={open}
            title="Sesi hampir berakhir"
            onClose={() => setOpen(false)}
            actions={
                <>
                    <button onClick={() => router.replace("/logout")}
                            className="rounded-lg border px-4 py-2 hover:bg-zinc-50">
                        Keluar
                    </button>
                    <button onClick={onExtend}
                            className="rounded-lg bg-amber-400 text-zinc-900 font-semibold px-4 py-2 hover:bg-amber-300">
                        Perpanjang 30 menit
                    </button>
                </>
            }
        >
            <p className="text-sm">
                Sesi Anda akan berakhir dalam <b>{remain != null ? mmss(remain) : "--:--"}</b>.
            </p>
            <p className="text-xs text-zinc-500 mt-1">
                Pilih <b>Perpanjang</b> untuk memperbarui sesi tanpa perlu login ulang.
            </p>
        </Modal>
    );
}
