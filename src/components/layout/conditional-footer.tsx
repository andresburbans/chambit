"use client";

import { usePathname } from "next/navigation";
import { FooterAurora } from "./footer-aurora";

export function ConditionalFooter() {
    const pathname = usePathname();

    // Hide footer inside dashboard and search (full-height infinite scroll pages)
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/search")) {
        return null;
    }

    return <FooterAurora />;
}