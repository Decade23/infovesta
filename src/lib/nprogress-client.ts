"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";

NProgress.configure({ showSpinner: false, trickleSpeed: 140, minimum: 0.08, speed: 300 });

export default function RouteProgress() {
    const pathname = usePathname();
    const search = useSearchParams();

    useEffect(() => {
        NProgress.start();
        const t = setTimeout(() => NProgress.done(), 250); // kecilin flicker
        return () => clearTimeout(t);
    }, [pathname, search]);

    return null;
}
