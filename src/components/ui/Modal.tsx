"use client";

import { useEffect } from "react";

type Props = {
    open: boolean;
    title?: string;
    onClose?: () => void;
    actions?: React.ReactNode;
    children?: React.ReactNode;
};

export default function Modal({ open, title, onClose, actions, children }: Props) {

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prev; };
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 h-screen z-[80] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative z-[81] w-[92%] max-w-md rounded-2xl bg-white shadow-lg p-5">
                {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
                <div className="text-sm">{children}</div>
                {actions && <div className="mt-4 flex gap-2 justify-end">{actions}</div>}
            </div>
        </div>
    );
}
