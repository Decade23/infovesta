"use client";

import {ToastProvider} from "@/components/ui/Toast";
import RouteProgress from "@/lib/nprogress-client";
import {Suspense} from "react";

export default function ClientProviders({children}: { children: React.ReactNode }) {
    return (
        <>
            <Suspense fallback={null}>
                <RouteProgress />
            </Suspense>
            <ToastProvider>{children}</ToastProvider>
        </>
    );
}
