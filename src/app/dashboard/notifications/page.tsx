"use client";

import { useState } from "react";
import { Bell, BellOff, Check, CheckCheck, Clock, Star, Briefcase, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { collection, query, where, orderBy, onSnapshot, writeBatch, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// ─── Types ───────────────────────────────────────────────────────────────────

type NotifType = "request" | "rating" | "offer" | "system";

interface Notification {
    id: string;
    type: NotifType;
    title: string;
    body: string;
    createdAt: string;
    read: boolean;
    link?: string;
}

// We removed MOCK_NOTIFS, we fetch dynamically now.

const ICON_MAP: Record<NotifType, React.ElementType> = {
    request: Briefcase,
    rating: Star,
    offer: CheckCheck,
    system: AlertCircle,
};

const ICON_BG: Record<NotifType, string> = {
    request: "bg-blue-50",
    rating: "bg-amber-50",
    offer: "bg-green-50",
    system: "bg-slate-50",
};

const ICON_COLOR: Record<NotifType, string> = {
    request: "text-blue-500",
    rating: "text-amber-500",
    offer: "text-[#34af00]",
    system: "text-slate-500",
};

// ─── Notification Item ────────────────────────────────────────────────────────

function NotifItem({ notif, onRead }: { notif: Notification; onRead: (id: string) => void }) {
    const Icon = ICON_MAP[notif.type];

    return (
        <button
            onClick={() => onRead(notif.id)}
            className={cn(
                "w-full flex items-start gap-3 p-4 text-left transition-all active:scale-[0.99]",
                "border-b border-slate-100 last:border-0",
                !notif.read && "bg-green-50/40"
            )}
        >
            {/* Icon */}
            <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5", ICON_BG[notif.type])}>
                <Icon className={cn("w-5 h-5", ICON_COLOR[notif.type])} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <p className={cn("text-sm leading-tight", !notif.read ? "font-bold text-slate-900" : "font-medium text-slate-700")}>
                        {notif.title}
                    </p>
                    {!notif.read && (
                        <span className="shrink-0 w-2 h-2 rounded-full bg-[#34af00] mt-1.5" />
                    )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">{notif.body}</p>
                <div className="flex items-center gap-1 mt-1.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-[11px] text-slate-400">{notif.createdAt}</span>
                </div>
            </div>
        </button>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
    const { user } = useAuth();
    const [notifs, setNotifs] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

    useEffect(() => {
        if (!user) return;
        setLoading(true);

        const q = query(
            collection(db, "notifications"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsub = onSnapshot(q, (snap) => {
            const fetched: Notification[] = snap.docs.map(d => {
                const data = d.data();

                // Map raw DB types to UI types
                let uiType: NotifType = "system";
                if (["new_offer"].includes(data.type)) uiType = "offer";
                if (["request_accepted", "new_request_nearby"].includes(data.type)) uiType = "request";
                if (["rate_reminder", "new_rating"].includes(data.type)) uiType = "rating";

                // Format date relative time roughly
                const date = data.createdAt?.toDate() || new Date();
                const diffHours = (new Date().getTime() - date.getTime()) / 3600000;
                let timeStr = "Hace un momento";
                if (diffHours >= 24) timeStr = `Hace ${Math.floor(diffHours / 24)} días`;
                else if (diffHours >= 1) timeStr = `Hace ${Math.floor(diffHours)}h`;

                return {
                    id: d.id,
                    type: uiType,
                    title: data.title || "Notificación",
                    body: data.body || "",
                    createdAt: timeStr,
                    read: data.read || false,
                };
            });
            setNotifs(fetched);
            setLoading(false);
        });

        return () => unsub();
    }, [user]);

    const unreadCount = notifs.filter((n) => !n.read).length;

    const handleRead = async (id: string) => {
        // Optimistic UI
        setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
        // Update DB
        try {
            const batch = writeBatch(db);
            batch.update(doc(db, "notifications", id), { read: true });
            await batch.commit();
        } catch (error) {
            console.error(error);
        }
    };

    const handleReadAll = async () => {
        const unreadIds = notifs.filter(n => !n.read).map(n => n.id);
        if (unreadIds.length === 0) return;

        // Optimistic UI
        setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

        // Update DB
        try {
            const batch = writeBatch(db);
            unreadIds.forEach(id => {
                batch.update(doc(db, "notifications", id), { read: true });
            });
            await batch.commit();
        } catch (error) {
            console.error(error);
        }
    };

    const displayed = activeTab === "unread" ? notifs.filter((n) => !n.read) : notifs;

    return (
        <div className="flex flex-col h-full">
            {/* Page header */}
            <div className="px-4 py-5 border-b border-slate-100">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Alertas</h1>
                        {unreadCount > 0 && (
                            <p className="text-sm text-slate-500 mt-0.5">{unreadCount} sin leer</p>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleReadAll}
                            className="flex items-center gap-1.5 text-xs font-semibold text-[#34af00] px-3 py-1.5 rounded-full border border-[#34af00]/30 bg-green-50 transition-all active:scale-95"
                        >
                            <Check className="w-3.5 h-3.5" />
                            Marcar todo leído
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mt-4 bg-slate-100 rounded-xl p-1">
                    {(["all", "unread"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all",
                                activeTab === tab
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500"
                            )}
                        >
                            {tab === "all" ? "Todas" : `Sin leer (${unreadCount})`}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto bg-white relative">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-[#34af00] animate-spin opacity-50" />
                    </div>
                ) : displayed.length > 0 ? (
                    displayed.map((n) => (
                        <NotifItem key={n.id} notif={n} onRead={handleRead} />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-8">
                        <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-4">
                            <BellOff className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-base font-bold text-slate-700">Sin notificaciones</p>
                        <p className="text-sm text-slate-400 mt-1">
                            {activeTab === "unread" ? "Todo está al día 🎉" : "Aquí aparecerán tus alertas."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
