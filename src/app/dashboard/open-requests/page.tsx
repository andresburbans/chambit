"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import {
    collection, query, where, orderBy, limit,
    onSnapshot, doc, updateDoc, addDoc, serverTimestamp, increment,
} from "firebase/firestore";
import {
    MapPin, Clock, DollarSign, Zap, ChevronRight,
    Star, PackageOpen, Loader2, CheckCircle, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OpenRequest {
    id: string;
    clientId: string;
    clientName: string;
    categoryId: string;
    subcategoryId: string;
    subcategoryName: string;
    description: string;
    urgency: "flexible" | "soon" | "urgent";
    budgetLabel: string;
    geozoneId: string;
    status: string;
    offerCount: number;
    createdAt: { seconds: number } | null;
    alreadyOffered?: boolean; // enriched client-side
}

const URGENCY_LABELS: Record<string, { label: string; color: string; bg: string }> = {
    flexible: { label: "Flexible", color: "text-slate-600", bg: "bg-slate-100" },
    soon: { label: "Pronto", color: "text-amber-700", bg: "bg-amber-50" },
    urgent: { label: "🔴 Urgente", color: "text-red-600", bg: "bg-red-50" },
};

// ─── Offer Modal ──────────────────────────────────────────────────────────────

function OfferModal({
    req,
    expertId,
    expertName,
    onClose,
    onSent,
}: {
    req: OpenRequest;
    expertId: string;
    expertName: string;
    onClose: () => void;
    onSent: () => void;
}) {
    const [price, setPrice] = useState("");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const handleSend = async () => {
        if (!price || isNaN(Number(price))) { setErr("Ingresa un precio válido."); return; }
        setLoading(true);
        setErr("");
        try {
            // Write offer to subcollection
            await addDoc(collection(db, `requests/${req.id}/offers`), {
                expertId,
                expertName,
                price: Number(price),
                note: note.trim(),
                status: "pending",
                createdAt: serverTimestamp(),
            });
            // Increment offer counter on the request doc
            await updateDoc(doc(db, "requests", req.id), {
                offerCount: increment(1),
            });
            onSent();
        } catch {
            setErr("Error al enviar. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

            {/* Sheet */}
            <div
                className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl"
                style={{ animation: "slideUp 0.25s cubic-bezier(0.32,0.72,0,1)", paddingBottom: "env(safe-area-inset-bottom)" }}
            >
                <div className="flex justify-center pt-3 pb-1.5">
                    <div className="w-10 h-1 rounded-full bg-slate-200" />
                </div>

                <div className="px-5 py-3">
                    <h3 className="text-lg font-bold text-slate-900">Enviar oferta</h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                        {req.subcategoryName} · {req.budgetLabel}
                    </p>
                </div>

                <div className="px-5 space-y-4 pb-4">
                    {/* Price */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Tu precio (COP)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="80,000"
                                className="w-full pl-8 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-900 outline-none focus:border-[#34af00] focus:bg-white transition-colors"
                            />
                        </div>
                    </div>

                    {/* Note */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Mensaje opcional</label>
                        <textarea
                            rows={3}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Ej: Cuento con los materiales y puedo ir hoy en la tarde..."
                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm placeholder:text-slate-400 outline-none focus:border-[#34af00] focus:bg-white transition-colors resize-none"
                        />
                    </div>

                    {err && (
                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200">
                            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                            <span className="text-xs text-red-600">{err}</span>
                        </div>
                    )}

                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="w-full h-[52px] rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                        style={{ background: "linear-gradient(135deg, #34af00, #2d9600)", boxShadow: "0 4px 20px rgba(52,175,0,.3)" }}
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                        {loading ? "Enviando..." : "Enviar oferta"}
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
            `}</style>
        </>
    );
}

// ─── Request Card ─────────────────────────────────────────────────────────────

function OpenRequestCard({
    req,
    onOffer,
}: {
    req: OpenRequest;
    onOffer: () => void;
}) {
    const urgency = URGENCY_LABELS[req.urgency] ?? URGENCY_LABELS.flexible;
    const timeAgo = req.createdAt
        ? formatDistanceToNow(new Date(req.createdAt.seconds * 1000), { locale: es, addSuffix: true })
        : "Recién publicada";

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-b border-slate-100">
                <span className="text-[11px] font-bold text-[#34af00] bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                    {req.subcategoryName}
                </span>
                <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full ml-auto", urgency.bg, urgency.color)}>
                    {urgency.label}
                </span>
            </div>

            <div className="p-4">
                {/* Client & time */}
                <div className="flex items-center gap-2 mb-2">
                    <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: "#e2e8f0", color: "#64748b" }}
                    >
                        {req.clientName?.[0] ?? "C"}
                    </div>
                    <p className="text-sm font-semibold text-slate-800">{req.clientName}</p>
                    <p className="text-xs text-slate-400 ml-auto">{timeAgo}</p>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-700 leading-snug line-clamp-3">{req.description}</p>

                {/* Meta row */}
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                    <div className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs text-slate-600 font-medium">{req.budgetLabel}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs text-slate-600">{req.offerCount} oferta{req.offerCount !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs text-slate-500">{req.urgency === "urgent" ? "Urgente" : "No urgente"}</span>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-3 flex gap-2">
                    {req.alreadyOffered ? (
                        <div className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-green-50 border border-green-200">
                            <CheckCircle className="w-4 h-4 text-[#34af00]" />
                            <span className="text-xs font-bold text-[#34af00]">Oferta enviada</span>
                        </div>
                    ) : (
                        <button
                            onClick={onOffer}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-white text-sm font-bold transition-all active:scale-95"
                            style={{ background: "linear-gradient(135deg, #34af00, #2d9600)" }}
                        >
                            <Zap className="w-4 h-4" /> Ofertar
                        </button>
                    )}
                    <button className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 transition-all active:scale-90">
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OpenRequestsFeedPage() {
    const { user } = useAuth();
    const [requests, setRequests] = useState<OpenRequest[]>([]);
    const [loadingFeed, setLoadingFeed] = useState(true);
    const [activeOffer, setActiveOffer] = useState<OpenRequest | null>(null);
    const [sentOffers, setSentOffers] = useState<Set<string>>(new Set());

    // ── Quality gate ──
    const canSeeRequests =
        user?.isExpertEnabled === true &&
        (
            (user?.expert?.ratingCount ?? 0) < 5 ||          // new expert grace period
            (user?.expert?.rating ?? 0) >= 4.0              // or well-rated
        );

    useEffect(() => {
        if (!user || !canSeeRequests) { setLoadingFeed(false); return; }

        // Build query: open requests matching expert's categories in their geozone
        // Firestore composite index needed: status + geozoneId + categoryId + createdAt (desc)
        const expertCategories: string[] = user?.preferredCategories ?? [];

        if (expertCategories.length === 0) { setLoadingFeed(false); return; }

        // Firestore "in" supports up to 30 values; categories are coarse strings
        const q = query(
            collection(db, "requests"),
            where("status", "==", "open"),
            where("geozoneId", "==", user.geozoneId ?? ""),
            where("categoryId", "in", expertCategories.slice(0, 10)),
            orderBy("createdAt", "desc"),
            limit(30)
        );

        const unsub = onSnapshot(q, (snap) => {
            setRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() } as OpenRequest)));
            setLoadingFeed(false);
        });

        return () => unsub();
    }, [user?.uid]);

    const handleOfferSent = (reqId: string) => {
        setSentOffers((prev) => new Set(prev).add(reqId));
        setActiveOffer(null);
    };

    // Enrich with local sent state
    const enriched = requests.map((r) => ({
        ...r,
        alreadyOffered: sentOffers.has(r.id),
    }));

    // ── Not expert / not enabled ──
    if (!user || user.role !== "expert") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center">
                <span className="text-5xl mb-4">🔒</span>
                <p className="text-base font-bold text-slate-700">Solo para expertos</p>
                <p className="text-sm text-slate-400 mt-1">Esta sección es exclusiva para expertos activos.</p>
            </div>
        );
    }

    if (!canSeeRequests) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center">
                <div className="w-16 h-16 rounded-3xl bg-amber-50 flex items-center justify-center mb-4">
                    <Star className="w-8 h-8 text-amber-500" />
                </div>
                <p className="text-base font-bold text-slate-700">Calificación insuficiente</p>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                    Para ver peticiones de clientes necesitas mantener una calificación ≥ 4.0 ⭐ con 5 o más reseñas.
                </p>
            </div>
        );
    }

    if (loadingFeed) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 text-[#34af00] animate-spin" />
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col min-h-full">
                {/* Header */}
                <div className="px-4 py-5 border-b border-slate-100 bg-white">
                    <h1 className="text-xl font-bold text-slate-900">Peticiones abiertas</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        {enriched.length > 0
                            ? `${enriched.length} solicitud${enriched.length > 1 ? "es" : ""} en tu zona`
                            : "Sin solicitudes por ahora"}
                    </p>
                </div>

                {/* Feed */}
                <div className="flex-1 px-4 py-4 space-y-3">
                    {enriched.length > 0 ? (
                        enriched.map((r) => (
                            <OpenRequestCard
                                key={r.id}
                                req={r}
                                onOffer={() => setActiveOffer(r)}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-4">
                                <PackageOpen className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-base font-bold text-slate-700">Sin peticiones en tu zona</p>
                            <p className="text-sm text-slate-400 mt-1">
                                Cuando los clientes publiquen solicitudes en tus categorías, aparecerán aquí.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Offer sheet */}
            {activeOffer && (
                <OfferModal
                    req={activeOffer}
                    expertId={user.uid}
                    expertName={user.displayName ?? "Experto"}
                    onClose={() => setActiveOffer(null)}
                    onSent={() => handleOfferSent(activeOffer.id)}
                />
            )}
        </>
    );
}
