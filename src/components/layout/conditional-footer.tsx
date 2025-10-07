"use client";

import { usePathname } from "next/navigation";
import { FooterAurora } from "./footer-aurora";

export function ConditionalFooter() {
    const pathname = usePathname();

    // Don't show footer on home page (search with infinite scroll)
    if (pathname === "/") {
        return null;
    }

    return <FooterAurora />;
}