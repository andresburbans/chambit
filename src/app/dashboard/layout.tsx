"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Briefcase, LayoutGrid, User, Bell, FileSearch } from "lucide-react"
import {
    Sidebar, SidebarContent, SidebarHeader,
    SidebarMenu, SidebarMenuItem, SidebarMenuButton,
    SidebarProvider, SidebarFooter,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/layout/logo"
import { UserNav } from "@/components/auth/user-nav"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [user, loading, router]);

    // Redirect to onboarding if profile is incomplete
    useEffect(() => {
        if (!loading && user && !user.role) {
            router.replace("/onboarding");
        }
    }, [user, loading, router]);

    // Listen to unread notifications count
    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, "notifications"),
            where("userId", "==", user.uid),
            where("read", "==", false)
        );
        const unsub = onSnapshot(q, snap => {
            setUnreadCount(snap.docs.length);
        });
        return () => unsub();
    }, [user]);

    // Show spinner while auth state resolves or redirecting
    if (loading || !user || (user && !user.role)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 text-[#34af00] animate-spin" />
            </div>
        );
    }

    const isExpert = user?.role === 'expert' || user?.role === 'both';

    const navItems = isExpert ? [
        { href: "/dashboard", label: "Panel", icon: LayoutGrid },
        { href: "/dashboard/opportunities", label: "Oportunidades", icon: Briefcase },
        { href: "/dashboard/open-requests", label: "Peticiones abiertas", icon: FileSearch },
        { href: "/dashboard/notifications", label: "Alertas", icon: Bell },
        { href: "/dashboard/profile", label: "Perfil", icon: User },
    ] : [
        { href: "/dashboard", label: "Panel", icon: LayoutGrid },
        { href: "/dashboard/requests", label: "Solicitudes", icon: Briefcase },
        { href: "/dashboard/notifications", label: "Alertas", icon: Bell },
        { href: "/dashboard/profile", label: "Perfil", icon: User },
    ];

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                {/* ── Desktop sidebar (hidden on mobile) ── */}
                <Sidebar className="hidden md:flex">
                    <SidebarHeader>
                        <Logo />
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <Link href={item.href} legacyBehavior passHref>
                                        <SidebarMenuButton
                                            isActive={pathname === item.href}
                                            tooltip={{ children: item.label }}
                                        >
                                            <div className="relative">
                                                <item.icon />
                                                {item.label === "Alertas" && unreadCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                                                        {unreadCount > 9 ? '9+' : unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                            <span>{item.label}</span>
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarContent>
                    <SidebarFooter>
                        <UserNav />
                    </SidebarFooter>
                </Sidebar>

                {/* ── Main content ── */}
                <main className="flex-1 flex flex-col min-w-0">
                    {/*
                        Mobile: no extra header (bottom nav from root layout handles navigation).
                        Desktop: small top bar with user nav.
                    */}
                    <header className="hidden md:flex h-14 items-center justify-between border-b px-6 bg-white shrink-0">
                        <span className="text-sm font-semibold text-slate-500 capitalize">
                            {pathname.split("/").filter(Boolean).slice(-1)[0] ?? "panel"}
                        </span>
                        <UserNav />
                    </header>

                    {/*
                        Content wrapper:
                        - Mobile: no padding (each page manages its own header + padding)
                        - Desktop: standard padding
                        - Bottom padding: 80px on mobile for bottom nav
                    */}
                    <div className="flex-1 overflow-y-auto md:p-6 pb-20 md:pb-6">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}
