"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/auth/user-nav";
import { Logo } from "./logo";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Bell,
  History,
  FileText,
  Briefcase,
  Search,
  Star,
  ShieldCheck,
  Zap,
  Users,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Wrench,
  TrendingUp,
  Grid3X3,
  Clock,
  Hammer,
  Cpu,
  Car,
  Scissors,
  HardHat,
} from "lucide-react";
import { useState, useEffect } from "react";

// ─── Mega Menu Data ─────────────────────────────────────────────────────────────

const CLIENT_ACTIONS = [
  {
    icon: Search,
    title: "Buscar expertos",
    desc: "Encuentra el profesional ideal en tu ciudad",
    href: "/search",
  },
  {
    icon: Star,
    title: "Mejor calificados",
    desc: "Los profesionales con mejores reseñas",
    href: "/search?sort=rating",
  },
  {
    icon: Zap,
    title: "Cómo funciona",
    desc: "Conéctate con expertos en 3 pasos simples",
    href: "/como-funciona",
  },
  {
    icon: ShieldCheck,
    title: "Expertos verificados",
    desc: "Perfiles validados con reputación real",
    href: "/search?verified=true",
  },
];

const CLIENT_CATEGORIES = [
  { icon: Hammer, label: "Reparación", href: "/search?cat=cat-reparacion" },
  { icon: Sparkles, label: "Limpieza", href: "/search?cat=cat-limpieza" },
  { icon: Cpu, label: "Tecnología", href: "/search?cat=cat-tecnologia" },
  { icon: Car, label: "Mecánica", href: "/search?cat=cat-mecanica" },
  { icon: Scissors, label: "Belleza", href: "/search?cat=cat-belleza" },
  { icon: HardHat, label: "Construcción", href: "/search?cat=cat-construccion" },
];

const EXPERT_ACTIONS = [
  {
    icon: Users,
    title: "Únete como experto",
    desc: "Crea tu perfil y empieza a conseguir clientes",
    href: "/register",
  },
  {
    icon: TrendingUp,
    title: "Gestiona tu negocio",
    desc: "Panel de control, oportunidades y estadísticas",
    href: "/dashboard",
  },
  {
    icon: MessageCircle,
    title: "Solicitudes cercanas",
    desc: "Clientes en tu zona buscan tus servicios hoy",
    href: "/dashboard/opportunities",
  },
  {
    icon: Wrench,
    title: "Cómo funciona para ti",
    desc: "Trabaja sin comisiones con Chambit",
    href: "/como-funciona",
  },
];

const EXPERT_BENEFITS = [
  "Sin comisiones — te quedas con todo",
  "Tú fijas tus precios y horarios",
  "Clientes verificados cerca de ti",
  "Sube tu reputación con cada trabajo",
];

// ─── Mega Menu Panels ──────────────────────────────────────────────────────────

function ClientPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="px-8 py-6 flex gap-8 max-w-[820px]">
      {/* Left: Actions */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          ¿Qué puedes hacer?
        </p>
        <div className="grid grid-cols-2 gap-1">
          {CLIENT_ACTIONS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                onClick={onClose}
                className="group flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
                  <Icon className="w-4 h-4 text-slate-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-[#34af00] transition-colors leading-tight">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-400 leading-tight mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="w-px bg-slate-100 shrink-0" />

      {/* Right: Categories */}
      <div className="w-44 shrink-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          Categorías
        </p>
        <div className="space-y-0.5">
          {CLIENT_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.label}
                href={cat.href}
                onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-[#34af00] transition-all font-medium"
              >
                <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                {cat.label}
              </Link>
            );
          })}
        </div>
        <Link
          href="/search"
          onClick={onClose}
          className="mt-3 flex items-center gap-1 px-3 text-xs font-bold text-[#34af00] hover:underline"
        >
          Ver todas <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Bottom CTA — spans full width, rendered as separate row */}
    </div>
  );
}

function ExpertPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="px-8 py-6 flex gap-8 max-w-[780px]">
      {/* Left: Actions */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          Trabaja con Chambit
        </p>
        <div className="grid grid-cols-2 gap-1">
          {EXPERT_ACTIONS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                onClick={onClose}
                className="group flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
                  <Icon className="w-4 h-4 text-slate-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-[#34af00] transition-colors leading-tight">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-400 leading-tight mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="w-px bg-slate-100 shrink-0" />

      {/* Right: Benefits card */}
      <div className="w-52 shrink-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          ¿Por qué unirte?
        </p>
        <div className="space-y-2">
          {EXPERT_BENEFITS.map((b) => (
            <div key={b} className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-[#34af00] flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-xs text-slate-600 leading-snug">{b}</p>
            </div>
          ))}
        </div>
        <Link
          href="/register"
          onClick={onClose}
          className="mt-4 flex items-center justify-center gap-1.5 text-xs font-bold text-white w-full px-3 py-2.5 rounded-xl transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #34af00, #2d9600)" }}
        >
          Crear mi perfil <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

// ─── Main Header ────────────────────────────────────────────────────────────────

export function Header() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Close on route change
  useEffect(() => {
    setActiveMenu(null);
  }, [pathname]);

  if (pathname.startsWith("/dashboard")) return null;

  const closeMenu = () => setActiveMenu(null);

  return (
    <>
      {/* Backdrop — clicking or hovering closes the menu */}
      {activeMenu && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: "rgba(0,0,0,0.08)" }}
          onClick={closeMenu}
        />
      )}

      <header
        className="hidden md:flex flex-col fixed top-0 left-0 right-0 z-50"
        style={{
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: activeMenu ? "1px solid transparent" : "1px solid #f1f5f9",
        }}
      >
        {/* ── Top bar ── */}
        <div className="h-[var(--header-height)] flex items-center justify-between px-8 max-w-7xl mx-auto w-full">

          {/* Logo + Nav */}
          <div className="flex items-center gap-8">
            <Logo />

            <nav className="flex items-center gap-0.5">
              {/* Para Clientes */}
              <button
                onMouseEnter={() => setActiveMenu("clientes")}
                onClick={() => setActiveMenu(activeMenu === "clientes" ? null : "clientes")}
                className={`flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${activeMenu === "clientes"
                    ? "text-[#34af00] bg-green-50"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                  }`}
              >
                Para Clientes
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === "clientes" ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Para Expertos */}
              <button
                onMouseEnter={() => setActiveMenu("expertos")}
                onClick={() => setActiveMenu(activeMenu === "expertos" ? null : "expertos")}
                className={`flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${activeMenu === "expertos"
                    ? "text-[#34af00] bg-green-50"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                  }`}
              >
                Para Expertos
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === "expertos" ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Simple links */}
              <Link
                href="/como-funciona"
                onClick={closeMenu}
                className="text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors"
              >
                Cómo funciona
              </Link>

              <Link
                href="/nosotros"
                onClick={closeMenu}
                className="text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors"
              >
                Nosotros
              </Link>
            </nav>
          </div>

          {/* Auth area */}
          <div className="flex items-center gap-2 shrink-0">
            {loading ? (
              <div className="h-9 w-40 animate-pulse rounded-xl bg-slate-100" />
            ) : user ? (
              /* Logged in */
              <div className="flex items-center gap-1.5">
                {user.role === "client" && (
                  <>
                    <Button variant="ghost" size="icon" asChild title="Mis solicitudes">
                      <Link href="/dashboard/requests"><FileText className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild title="Historial">
                      <Link href="/dashboard/history"><History className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild title="Notificaciones">
                      <Link href="/dashboard/notifications"><Bell className="h-4 w-4" /></Link>
                    </Button>
                    <div className="w-px h-5 bg-slate-200 mx-1" />
                    <Link
                      href="/onboarding"
                      className="flex items-center gap-1.5 text-sm font-semibold text-[#34af00] hover:text-[#2d9600] px-3 py-1.5 rounded-xl hover:bg-green-50 transition-all"
                    >
                      <Zap className="w-3.5 h-3.5" /> Ganar dinero
                    </Link>
                  </>
                )}
                {user.role === "expert" && (
                  <>
                    <Button variant="ghost" size="icon" asChild title="Oportunidades">
                      <Link href="/dashboard/opportunities"><Briefcase className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild title="Notificaciones">
                      <Link href="/dashboard/notifications"><Bell className="h-4 w-4" /></Link>
                    </Button>
                    <div className="w-px h-5 bg-slate-200 mx-1" />
                    <span className="text-xs font-bold text-[#34af00] bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                      Modo Experto
                    </span>
                  </>
                )}
                {user.role === "both" && (
                  <>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href="/dashboard/notifications"><Bell className="h-4 w-4" /></Link>
                    </Button>
                    <div className="w-px h-5 bg-slate-200 mx-1" />
                  </>
                )}
                <UserNav />
              </div>
            ) : (
              /* Guest */
              <div className="flex items-center gap-1">
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-2 rounded-xl transition-colors hover:bg-slate-50"
                >
                  Ingresar
                </Link>
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <Link
                  href="/register?rol=experto"
                  className="text-sm font-medium text-slate-500 hover:text-slate-700 px-3 py-2 rounded-xl transition-colors"
                >
                  Soy experto
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 text-sm font-bold text-white px-4 py-2 rounded-xl ml-1 transition-all hover:opacity-90 hover:shadow-md hover:shadow-green-500/20"
                  style={{ background: "linear-gradient(135deg, #34af00, #2d9600)" }}
                >
                  Registrarse <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ── Mega menu panel — part of the header, not positioned relative to nav item ── */}
        {activeMenu && (
          <div
            className="border-t border-slate-100 bg-white w-full"
            onMouseLeave={closeMenu}
            style={{
              animation: "dropIn 0.16s cubic-bezier(0.16,1,0.3,1)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            }}
          >
            {/* Inner container aligned with header content */}
            <div className="max-w-7xl mx-auto px-8">
              {activeMenu === "clientes" && <ClientPanel onClose={closeMenu} />}
              {activeMenu === "expertos" && <ExpertPanel onClose={closeMenu} />}
            </div>
          </div>
        )}
      </header>

      <style jsx global>{`
        @keyframes dropIn {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
