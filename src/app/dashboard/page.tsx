"use client";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getCountFromServer } from "firebase/firestore";
import {
  Search, Briefcase, Star, Bell, ArrowRight,
  Loader2, ClipboardList, Zap, ChevronRight, MapPin
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon, label, value, color, loading
}: {
  icon: React.ElementType; label: string; value: string | number;
  color: string; loading?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        {loading
          ? <div className="h-5 w-8 bg-slate-100 rounded animate-pulse mt-0.5" />
          : <p className="text-xl font-extrabold text-slate-900">{value}</p>
        }
      </div>
    </div>
  );
}

// ─── Quick Action ─────────────────────────────────────────────────────────────

function QuickAction({ href, icon: Icon, label, desc, color }: {
  href: string; icon: React.ElementType; label: string; desc: string; color: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-[#34af00]/40 hover:shadow-md transition-all active:scale-[0.98] group"
    >
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-slate-900 group-hover:text-[#34af00] transition-colors">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#34af00] transition-colors" />
    </Link>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState({ requests: 0, notifications: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  const isExpert = user?.role === "expert" || user?.role === "both";

  useEffect(() => {
    if (!user?.uid) return;

    const fetchStats = async () => {
      try {
        const [reqSnap, notifSnap] = await Promise.all([
          getCountFromServer(query(
            collection(db, "requests"),
            where(isExpert ? "acceptedExpertId" : "clientId", "==", user.uid),
            where("status", "in", isExpert
              ? ["accepted", "in_progress", "pending_confirmation"]
              : ["open", "accepted", "in_progress", "pending_confirmation"]
            )
          )),
          getCountFromServer(query(
            collection(db, "notifications"),
            where("userId", "==", user.uid),
            where("read", "==", false)
          )),
        ]);
        setStats({
          requests: reqSnap.data().count,
          notifications: notifSnap.data().count,
        });
      } catch {
        // Firestore rules may block count queries without auth - silent fail
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [user?.uid]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-[#34af00] animate-spin" />
      </div>
    );
  }

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "¡Buenos días";
    if (h < 18) return "¡Buenas tardes";
    return "¡Buenas noches";
  })();

  const firstName = user.firstName || user.displayName?.split(" ")[0] || "Usuario";

  return (
    <div className="flex flex-col bg-[#f8fafc] min-h-full">
      {/* Hero Header */}
      <div
        className="relative px-5 pt-8 pb-14 text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1e6e00 0%, #34af00 70%, #4acf10 100%)" }}
      >
        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/10" />
        <div className="absolute -left-4 bottom-0 w-24 h-24 rounded-full bg-white/5" />
        <div className="relative">
          <p className="text-white/70 text-sm font-medium">{greeting},</p>
          <h1 className="text-2xl font-extrabold mt-0.5">{firstName}! 👋</h1>
          {isExpert && (
            <div className="flex items-center gap-1.5 mt-2">
              <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
              <span className="text-white/80 text-xs font-medium">
                {user.expert?.rating ? `${user.expert.rating.toFixed(1)} calificación` : "Nuevo experto"} ·{" "}
              </span>
              <MapPin className="w-3 h-3 text-white/60" />
              <span className="text-white/60 text-xs">Cali, Colombia</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats cards (floating over hero) */}
      <div className="grid grid-cols-2 gap-3 px-4 -mt-7 mb-6 relative z-10">
        <StatCard
          icon={isExpert ? Briefcase : ClipboardList}
          label={isExpert ? "Trabajos activos" : "Solicitudes activas"}
          value={stats.requests}
          color="#34af00"
          loading={loadingStats}
        />
        <StatCard
          icon={Bell}
          label="Alertas sin leer"
          value={stats.notifications}
          color="#0ea5e9"
          loading={loadingStats}
        />
      </div>

      {/* Quick actions */}
      <div className="px-4 space-y-3 mb-6">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Acciones rápidas</p>

        {/* Client actions */}
        {!isExpert && (
          <>
            <QuickAction
              href="/search"
              icon={Search}
              label="Buscar un experto"
              desc="Encuentra profesionales en tu zona"
              color="#34af00"
            />
            <QuickAction
              href="/dashboard/requests/new"
              icon={ClipboardList}
              label="Nueva solicitud"
              desc="Publica lo que necesitas y recibe ofertas"
              color="#8b5cf6"
            />
            <QuickAction
              href="/dashboard/requests"
              icon={Briefcase}
              label="Mis solicitudes"
              desc="Ver el estado de tus pedidos"
              color="#0ea5e9"
            />
          </>
        )}

        {/* Expert actions */}
        {isExpert && (
          <>
            <QuickAction
              href="/dashboard/open-requests"
              icon={Zap}
              label="Ver peticiones abiertas"
              desc="Clientes buscando tu servicio ahora"
              color="#34af00"
            />
            <QuickAction
              href="/dashboard/opportunities"
              icon={Briefcase}
              label="Mis trabajos"
              desc="Trabajos aceptados y en curso"
              color="#0ea5e9"
            />
            <QuickAction
              href="/search"
              icon={Search}
              label="Buscar otros expertos"
              desc="Explora la plataforma como cliente"
              color="#8b5cf6"
            />
          </>
        )}

        <QuickAction
          href="/dashboard/notifications"
          icon={Bell}
          label="Alertas"
          desc={stats.notifications > 0 ? `Tienes ${stats.notifications} sin leer` : "Sin notificaciones nuevas"}
          color="#f59e0b"
        />
      </div>

      {/* Expert promo (for clients) */}
      {!isExpert && (
        <div className="px-4 mb-6">
          <div
            className="rounded-3xl p-5 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #34af00, #1e6e00)" }}
          >
            <div className="absolute right-0 top-0 w-24 h-24 rounded-full bg-white/10 -translate-y-4 translate-x-4" />
            <div className="relative">
              <p className="text-white/80 text-xs font-semibold mb-1">¿Tienes un talento?</p>
              <p className="text-white font-extrabold text-base mb-3">Conviértete en experto y gana dinero extra 💰</p>
              <button
                onClick={() => router.push("/onboarding/expert")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#34af00] text-sm font-bold transition-all hover:shadow-md active:scale-95"
              >
                Comenzar <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
