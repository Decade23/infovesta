"use client";
import React, {createContext, useCallback, useContext, useState} from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

type ToastType = "success" | "error" | "info";
export type ToastItem = { id: string; title?: string; message: string; type?: ToastType; duration?: number };

type ToastCtx = { push: (t: Omit<ToastItem,"id">) => void };
const Ctx = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<ToastItem[]>([]);

    const push = useCallback((t: Omit<ToastItem,"id">) => {
        const id = crypto.randomUUID();
        const item: ToastItem = { id, type: "info", duration: 3000, ...t };
        setItems(s => [...s, item]);
        setTimeout(() => setItems(s => s.filter(x => x.id !== id)), item.duration);
    }, []);

    const remove = (id: string) => setItems(s => s.filter(x => x.id !== id));

    return (
        <Ctx.Provider value={{ push }}>
            {children}
            {/* viewport */}
            <div className="fixed z-[9999] bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md space-y-2">
                {items.map(t => (
                    <div key={t.id}
                         className="rounded-xl border bg-white/95 backdrop-blur shadow-lg p-3 flex items-start gap-3 animate-[slideUp_.2s_ease-out]"
                         role="status" aria-live="polite">
                        {t.type === "success" ? <CheckCircle2 className="text-green-600 mt-0.5"/> :
                            t.type === "error"   ? <AlertCircle   className="text-red-600 mt-0.5"/>   :
                                <div className="w-5 h-5 rounded-full bg-amber-400 mt-0.5" />}
                        <div className="flex-1">
                            {t.title && <div className="font-semibold">{t.title}</div>}
                            <div className="text-sm text-zinc-700">{t.message}</div>
                        </div>
                        <button onClick={() => remove(t.id)} className="p-1 text-zinc-500 hover:text-zinc-700">
                            <X size={16}/>
                        </button>
                    </div>
                ))}
            </div>
        </Ctx.Provider>
    );
}

export function useToast() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
}

/* animasi sederhana */
const style = typeof window !== "undefined" ? document.createElement("style") : null;
if (style) {
    style.innerHTML = `@keyframes slideUp{from{transform:translateY(8px);opacity:.0}to{transform:translateY(0);opacity:1}}`;
    document.head.appendChild(style);
}
