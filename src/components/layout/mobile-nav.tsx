"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ClipboardList, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Routes where the bottom nav should be hidden (clean/full-screen pages)
const HIDDEN_ROUTES = ["/login", "/register", "/onboarding", "/autorizacion-datos", "/privacidad", "/terminos", "/dashboard/chat"];

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

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

  // Hide on specific routes
  if (HIDDEN_ROUTES.some((r) => pathname.startsWith(r))) return null;

  // Build tab items based on role
  const tabs = [
    {
      href: "/",
      label: "Inicio",
      icon: Home,
      activeOn: ["/"],
    },
    {
      href: "/search",
      label: "Buscar",
      icon: Search,
      activeOn: ["/search"],
    },
    {
      href: user?.role === "expert" ? "/dashboard/opportunities" : "/dashboard/requests",
      label: user?.role === "expert" ? "Oportunidades" : "Solicitudes",
      icon: ClipboardList,
      activeOn: ["/dashboard/requests", "/dashboard/opportunities"],
      requiresAuth: true,
    },
    {
      href: "/dashboard/notifications",
      label: "Alertas",
      icon: Bell,
      activeOn: ["/dashboard/notifications"],
      requiresAuth: true,
      badge: unreadCount,
    },
    {
      href: user ? "/dashboard/profile" : "/login",
      label: "Perfil",
      icon: User,
      activeOn: ["/dashboard/profile", "/login"],
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid #f1f5f9",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.06)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex justify-around items-center h-16 px-1">
        {tabs.map((tab) => {
          // For auth-required tabs, redirect to login if not authenticated
          const resolvedHref = tab.requiresAuth && !user ? "/login" : tab.href;
          const isActive = tab.activeOn.some((route) =>
            route === "/" ? pathname === "/" : pathname.startsWith(route)
          );

          return (
            <Link
              key={tab.label}
              href={resolvedHref}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 flex-1 py-2",
                "transition-all duration-200 active:scale-95",
                "rounded-xl mx-0.5",
                isActive
                  ? "text-[#34af00]"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              {/* Icon container with active indicator */}
              <div className="relative">
                <tab.icon
                  className={cn(
                    "transition-all duration-200",
                    isActive ? "w-6 h-6 stroke-[2.2]" : "w-6 h-6 stroke-[1.5]"
                  )}
                />

                {/* Active dot indicator */}
                {isActive && (
                  <span
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#34af00]"
                    style={{ animation: "scaleIn 0.2s ease" }}
                  />
                )}

                {/* Unread badge (Alertas) */}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1 leading-none">
                    {tab.badge > 99 ? "99+" : tab.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-[10px] font-medium transition-all duration-200 leading-none mt-1",
                  isActive ? "font-semibold" : "font-medium"
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>

      <style jsx>{`
                @keyframes scaleIn {
                    from { transform: translateX(-50%) scale(0); }
                    to   { transform: translateX(-50%) scale(1); }
                }
            `}</style>
    </nav>
  );
}
