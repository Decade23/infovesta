"use client";

import {ToastProvider} from "@/components/ui/Toast";
import RouteProgress from "@/lib/nprogress-client";

export default function ClientProviders({children}: { children: React.ReactNode }) {
    return (
        <>
            <RouteProgress/>
            <ToastProvider>{children}</ToastProvider>
        </>
    );
}
