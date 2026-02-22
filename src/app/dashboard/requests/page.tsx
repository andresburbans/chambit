"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Clock, CheckCircle, XCircle, Star, Search, PackageOpen, Plus,
    Loader2, MessageCircle, X, Zap, AlertCircle, User, DollarSign,
    ChevronDown, ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import {
    collection, query, where, orderBy, onSnapshot,
    doc, updateDoc, getDocs, addDoc, serverTimestamp,
    writeBatch, runTransaction,
} from "firebase/firestore";

// ─── Types ────────────────────────────────────────────────────────────────────

type RequestStatus = "open" | "accepted" | "in_progress" | "pending_confirmation" | "completed" | "cancelled";

interface ServiceRequest {
    id: string;
    clientId: string;
    subcategoryName: string;
    categoryId: string;
    description: string;
    urgency: "flexible" | "soon" | "urgent";
    budgetLabel: string;
    status: RequestStatus;
    offerCount: number;
    acceptedExpertId?: string;
    acceptedExpertName?: string;
    acceptedPrice?: number;
    ratingDone?: boolean;
    createdAt: { seconds: number } | null;
}

interface Offer {
    id: string;
    expertId: string;
    expertName: string;
    expertRating?: number;
    expertVerified?: boolean;
    price: number;
    note: string;
    status: "pending" | "accepted" | "rejected";
    createdAt: { seconds: number } | null;
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CFG: Record<RequestStatus, { label: string; color: string; bg: string; bar: string }> = {
    open: { label: "Buscando experto", color: "text-amber-700", bg: "bg-amber-50", bar: "bg-amber-400" },
    accepted: { label: "Experto vinculado", color: "text-blue-700", bg: "bg-blue-50", bar: "bg-blue-500" },
    in_progress: { label: "En curso", color: "text-[#34af00]", bg: "bg-green-50", bar: "bg-[#34af00]" },
    pending_confirmation: { label: "Pendiente confirmar", color: "text-purple-700", bg: "bg-purple-50", bar: "bg-purple-500" },
    completed: { label: "Completada", color: "text-slate-600", bg: "bg-slate-100", bar: "bg-slate-400" },
    cancelled: { label: "Cancelada", color: "text-red-600", bg: "bg-red-50", bar: "bg-red-400" },
};

// ─── Rating Modal ─────────────────────────────────────────────────────────────

function RatingModal({
    req, clientId, onClose, onDone,
}: {
    req: ServiceRequest; clientId: string; onClose: () => void; onDone: () => void;
}) {
    const [stars, setStars] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const handleRate = async () => {
        if (stars === 0) { setErr("Selecciona una calificación."); return; }
        setLoading(true);
        try {
            // Write rating
            await addDoc(collection(db, "ratings"), {
                requestId: req.id,
                clientId,
                expertId: req.acceptedExpertId,
                score: stars,
                comment: comment.trim(),
                createdAt: serverTimestamp(),
            });

            // Update expert rating with transaction
            if (req.acceptedExpertId) {
                await runTransaction(db, async (tx) => {
                    const expertRef = doc(db, "users", req.acceptedExpertId!);
                    const expertSnap = await tx.get(expertRef);
                    if (!expertSnap.exists()) return;
                    const data = expertSnap.data();
                    const oldSum = data?.expert?.ratingSum ?? 0;
                    const oldCount = data?.expert?.ratingCount ?? 0;
                    const newSum = oldSum + stars;
                    const newCount = oldCount + 1;
                    tx.update(expertRef, {
                        "expert.ratingSum": newSum,
                        "expert.ratingCount": newCount,
                        "expert.rating": Math.round((newSum / newCount) * 10) / 10,
                    });
                });
            }

            // Mark request ratingDone
            await updateDoc(doc(db, "requests", req.id), { ratingDone: true });
            onDone();
        } catch {
            setErr("Error al guardar la calificación.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
            <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-3xl shadow-2xl p-6 max-w-sm mx-auto">
                <h3 className="text-lg font-bold text-slate-900 mb-1 text-center">¿Cómo te fue?</h3>
                <p className="text-sm text-slate-500 text-center mb-5">
                    Califica a <strong>{req.acceptedExpertName}</strong> por el servicio "{req.subcategoryName}"
                </p>

                {/* Stars */}
                <div className="flex justify-center gap-2 mb-5">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <button
                            key={s}
                            onMouseEnter={() => setHover(s)}
                            onMouseLeave={() => setHover(0)}
                            onClick={() => setStars(s)}
                        >
                            <Star className={cn(
                                "w-10 h-10 transition-all",
                                s <= (hover || stars) ? "fill-amber-400 text-amber-400 scale-110" : "text-slate-200"
                            )} />
                        </button>
                    ))}
                </div>

                <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Cuéntanos cómo fue la experiencia (opcional)..."
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-[#34af00] resize-none mb-3"
                />

                {err && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-xl mb-3">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                        <span className="text-xs text-red-600">{err}</span>
                    </div>
                )}

                <div className="flex gap-2">
                    <button onClick={onClose} className="flex-1 h-11 rounded-2xl border border-slate-200 text-slate-600 text-sm font-medium">
                        Ahora no
                    </button>
                    <button
                        onClick={handleRate}
                        disabled={loading}
                        className="flex-1 h-11 rounded-2xl text-white text-sm font-bold flex items-center justify-center gap-1.5 disabled:opacity-50"
                        style={{ background: "linear-gradient(135deg, #34af00, #2d9600)" }}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
                        Enviar
                    </button>
                </div>
            </div>
        </>
    );
}

// ─── Offers Bottom Sheet ──────────────────────────────────────────────────────

function OffersSheet({
    req, onClose, onAccepted,
}: {
    req: ServiceRequest; onClose: () => void; onAccepted: () => void;
}) {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [accepting, setAccepting] = useState<string | null>(null);

    useEffect(() => {
        const q = query(
            collection(db, `requests/${req.id}/offers`),
            orderBy("createdAt", "asc")
        );
        const unsub = onSnapshot(q, (snap) => {
            setOffers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Offer)));
            setLoading(false);
        });
        return () => unsub();
    }, [req.id]);

    const handleAccept = async (offer: Offer) => {
        setAccepting(offer.id);
        try {
            const batch = writeBatch(db);

            // Update request: accepted
            batch.update(doc(db, "requests", req.id), {
                status: "accepted",
                acceptedExpertId: offer.expertId,
                acceptedExpertName: offer.expertName,
                acceptedPrice: offer.price,
                matchedAt: serverTimestamp(),
            });

            // Mark this offer as accepted, others as rejected
            for (const o of offers) {
                batch.update(doc(db, `requests/${req.id}/offers`, o.id), {
                    status: o.id === offer.id ? "accepted" : "rejected",
                });
            }

            // Create notification for expert
            batch.set(doc(collection(db, "notifications")), {
                recipientId: offer.expertId,
                type: "offer_accepted",
                title: "¡Tu propuesta fue aceptada!",
                body: `${req.subcategoryName} — Precio acordado: $${offer.price.toLocaleString()}`,
                requestId: req.id,
                read: false,
                createdAt: serverTimestamp(),
            });

            await batch.commit();
            onAccepted();
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setAccepting(null);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
            <div
                className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl"
                style={{ maxHeight: "80vh", animation: "slideUp .3s cubic-bezier(0.32,0.72,0,1)", paddingBottom: "env(safe-area-inset-bottom)" }}
            >
                <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 rounded-full bg-slate-200" /></div>

                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Propuestas recibidas</h3>
                        <p className="text-xs text-slate-500">{req.subcategoryName}</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <X className="w-4 h-4 text-slate-500" />
                    </button>
                </div>

                <div className="overflow-y-auto" style={{ maxHeight: "calc(80vh - 5rem)" }}>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 text-[#34af00] animate-spin" />
                        </div>
                    ) : offers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center px-8">
                            <span className="text-4xl mb-3">📭</span>
                            <p className="text-sm font-bold text-slate-700">Aún no hay propuestas</p>
                            <p className="text-xs text-slate-400 mt-1">Los expertos en tu zona verán tu solicitud pronto.</p>
                        </div>
                    ) : (
                        <div className="p-4 space-y-3">
                            {offers.map((offer) => (
                                <div key={offer.id} className={cn(
                                    "rounded-2xl border p-4",
                                    offer.status === "accepted" ? "border-[#34af00] bg-green-50" : "border-slate-100 bg-white"
                                )}>
                                    {/* Expert info */}
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#34af00] to-[#2d9600] flex items-center justify-center text-white font-bold shrink-0">
                                            {offer.expertName?.[0] ?? "E"}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-1.5">
                                                <p className="text-sm font-bold text-slate-900">{offer.expertName}</p>
                                                {offer.expertVerified && (
                                                    <span className="w-4 h-4 rounded-full bg-[#34af00] flex items-center justify-center shrink-0">
                                                        <span className="text-white text-[8px] font-bold">✓</span>
                                                    </span>
                                                )}
                                            </div>
                                            {offer.expertRating && (
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                    <span className="text-xs font-semibold text-slate-700">{offer.expertRating}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-lg font-extrabold text-[#34af00]">
                                                ${offer.price.toLocaleString()}
                                            </p>
                                            <p className="text-[10px] text-slate-400">precio propuesto</p>
                                        </div>
                                    </div>

                                    {offer.note && (
                                        <p className="text-xs text-slate-600 bg-slate-50 rounded-xl px-3 py-2 mb-3 leading-relaxed">
                                            "{offer.note}"
                                        </p>
                                    )}

                                    {offer.status === "accepted" ? (
                                        <div className="flex items-center gap-2 py-2 justify-center">
                                            <CheckCircle className="w-4 h-4 text-[#34af00]" />
                                            <span className="text-sm font-bold text-[#34af00]">Propuesta aceptada</span>
                                        </div>
                                    ) : offer.status === "rejected" ? (
                                        <div className="flex items-center gap-2 py-2 justify-center">
                                            <XCircle className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm text-slate-400">No seleccionada</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleAccept(offer)}
                                            disabled={accepting === offer.id}
                                            className="w-full h-11 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-all active:scale-95"
                                            style={{ background: "linear-gradient(135deg, #34af00, #2d9600)", boxShadow: "0 4px 16px rgba(52,175,0,.3)" }}
                                        >
                                            {accepting === offer.id
                                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                                : <Zap className="w-4 h-4" />}
                                            {accepting === offer.id ? "Vinculando..." : "Vincularme con este experto"}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <style jsx>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
        </>
    );
}

// ─── Cancel Confirm Sheet ─────────────────────────────────────────────────────

function CancelSheet({ req, onClose }: { req: ServiceRequest; onClose: () => void }) {
    const [loading, setLoading] = useState(false);

    const handleCancel = async () => {
        setLoading(true);
        try {
            await updateDoc(doc(db, "requests", req.id), {
                status: "cancelled",
                cancelledAt: serverTimestamp(),
            });
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
            <div className="fixed inset-x-4 bottom-8 z-50 bg-white rounded-3xl shadow-2xl p-6 max-w-sm mx-auto">
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-red-500" />
                    </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 text-center mb-1">¿Cancelar solicitud?</h3>
                <p className="text-sm text-slate-500 text-center mb-5">
                    Esta acción no se puede deshacer. Los expertos que ofertaron serán notificados.
                </p>
                <div className="flex gap-2">
                    <button onClick={onClose} className="flex-1 h-11 rounded-2xl border border-slate-200 text-slate-700 text-sm font-medium">
                        Volver
                    </button>
                    <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="flex-1 h-11 rounded-2xl bg-red-500 text-white text-sm font-bold flex items-center justify-center gap-1.5 disabled:opacity-60"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                        Cancelar solicitud
                    </button>
                </div>
            </div>
        </>
    );
}

// ─── Confirm Completion Sheet ─────────────────────────────────────────────────

function ConfirmSheet({ req, onClose }: { req: ServiceRequest; onClose: () => void }) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await updateDoc(doc(db, "requests", req.id), {
                status: "completed",
                completedAt: serverTimestamp(),
                ratingDone: false,
            });
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
            <div className="fixed inset-x-4 bottom-8 z-50 bg-white rounded-3xl shadow-2xl p-6 max-w-sm mx-auto">
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-[#34af00]" />
                    </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 text-center mb-1">¿El trabajo está listo?</h3>
                <p className="text-sm text-slate-500 text-center mb-5">
                    Confirma que <strong>{req.acceptedExpertName}</strong> completó el servicio satisfactoriamente.
                </p>
                <div className="flex gap-2">
                    <button onClick={onClose} className="flex-1 h-11 rounded-2xl border border-slate-200 text-slate-700 text-sm font-medium">
                        No aún
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="flex-1 h-11 rounded-2xl text-white text-sm font-bold flex items-center justify-center gap-1.5 disabled:opacity-60"
                        style={{ background: "linear-gradient(135deg, #34af00, #2d9600)" }}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Confirmar
                    </button>
                </div>
            </div>
        </>
    );
}

// ─── Request Card ─────────────────────────────────────────────────────────────

function RequestCard({
    req, userId,
    onViewOffers, onCancel, onConfirm, onRate, onChat,
}: {
    req: ServiceRequest;
    userId: string;
    onViewOffers: () => void;
    onCancel: () => void;
    onConfirm: () => void;
    onRate: () => void;
    onChat: () => void;
}) {
    const cfg = STATUS_CFG[req.status];
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Status bar */}
            <div className={cn("h-1 w-full", cfg.bar)} />

            {/* Header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-start gap-3 p-4 text-left"
            >
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{req.subcategoryName}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5 line-clamp-1">{req.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", cfg.bg, cfg.color)}>
                            {cfg.label}
                        </span>
                        {req.offerCount > 0 && req.status === "open" && (
                            <span className="text-[10px] font-semibold text-[#34af00] bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                                {req.offerCount} propuesta{req.offerCount !== 1 ? "s" : ""}
                            </span>
                        )}
                        {req.acceptedExpertName && (
                            <span className="text-[10px] text-slate-500 truncate">· {req.acceptedExpertName}</span>
                        )}
                    </div>
                </div>
                <div className="shrink-0 mt-0.5">
                    {expanded
                        ? <ChevronUp className="w-4 h-4 text-slate-400" />
                        : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
            </button>

            {/* Expanded actions */}
            {expanded && (
                <div className="px-4 pb-4 space-y-2 border-t border-slate-50 pt-3">
                    {/* Budget */}
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Presupuesto: <strong className="text-slate-700">{req.budgetLabel}</strong></span>
                        {req.acceptedPrice && (
                            <span className="ml-2 text-[#34af00] font-bold">Acordado: ${req.acceptedPrice.toLocaleString()}</span>
                        )}
                    </div>

                    {/* Action buttons by status */}
                    <div className="flex gap-2 flex-wrap mt-2">

                        {/* OPEN: ver propuestas */}
                        {req.status === "open" && req.offerCount > 0 && (
                            <button
                                onClick={onViewOffers}
                                className="flex-1 h-10 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                                style={{ background: "linear-gradient(135deg, #34af00, #2d9600)" }}
                            >
                                <Zap className="w-3.5 h-3.5" />
                                Ver propuestas ({req.offerCount})
                            </button>
                        )}

                        {req.status === "open" && req.offerCount === 0 && (
                            <div className="flex-1 flex items-center gap-1.5 h-10 px-3 rounded-xl bg-amber-50 border border-amber-200">
                                <Clock className="w-3.5 h-3.5 text-amber-500" />
                                <span className="text-xs text-amber-700 font-medium">Esperando propuestas</span>
                            </div>
                        )}

                        {/* ACCEPTED: chat + ver info */}
                        {req.status === "accepted" && (
                            <button
                                onClick={onChat}
                                className="flex-1 h-10 rounded-xl bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                            >
                                <MessageCircle className="w-3.5 h-3.5" /> Chatear
                            </button>
                        )}

                        {/* IN PROGRESS: chat + confirmar */}
                        {req.status === "in_progress" && (
                            <>
                                <button onClick={onChat} className="h-10 px-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold flex items-center gap-1.5">
                                    <MessageCircle className="w-3.5 h-3.5" /> Chat
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="flex-1 h-10 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95"
                                    style={{ background: "linear-gradient(135deg, #34af00, #2d9600)" }}
                                >
                                    <CheckCircle className="w-3.5 h-3.5" /> Confirmar finalización
                                </button>
                            </>
                        )}

                        {/* PENDING_CONFIRMATION: waiting expert */}
                        {req.status === "pending_confirmation" && (
                            <div className="flex-1 flex items-center gap-1.5 h-10 px-3 rounded-xl bg-purple-50 border border-purple-200">
                                <Clock className="w-3.5 h-3.5 text-purple-500" />
                                <span className="text-xs text-purple-700 font-medium">Esperando confirmación del experto</span>
                            </div>
                        )}

                        {/* COMPLETED: calificar */}
                        {req.status === "completed" && !req.ratingDone && (
                            <button
                                onClick={onRate}
                                className="flex-1 h-10 rounded-xl border-2 border-amber-400 text-amber-600 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95"
                            >
                                <Star className="w-3.5 h-3.5 fill-amber-400" /> Calificar
                            </button>
                        )}
                        {req.status === "completed" && req.ratingDone && (
                            <div className="flex-1 flex items-center gap-1.5 h-10 px-3 rounded-xl bg-slate-50 border border-slate-200">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                <span className="text-xs text-slate-600">Ya calificaste este servicio</span>
                            </div>
                        )}

                        {/* Cancel (open or accepted, before started) */}
                        {(req.status === "open" || req.status === "accepted") && (
                            <button
                                onClick={onCancel}
                                className="h-10 px-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-1.5"
                            >
                                <XCircle className="w-3.5 h-3.5" /> Cancelar
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RequestsPage() {
    const { user } = useAuth();
    const router = useRouter();

    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<"active" | "history">("active");

    // Sheets state
    const [offersTarget, setOffersTarget] = useState<ServiceRequest | null>(null);
    const [cancelTarget, setCancelTarget] = useState<ServiceRequest | null>(null);
    const [confirmTarget, setConfirmTarget] = useState<ServiceRequest | null>(null);
    const [ratingTarget, setRatingTarget] = useState<ServiceRequest | null>(null);

    // Real Firestore subscription
    useEffect(() => {
        if (!user?.uid) return;
        const q = query(
            collection(db, "requests"),
            where("clientId", "==", user.uid),
            orderBy("createdAt", "desc")
        );
        const unsub = onSnapshot(q, (snap) => {
            setRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ServiceRequest)));
            setLoading(false);
        });
        return () => unsub();
    }, [user?.uid]);

    const ACTIVE_STATUSES: RequestStatus[] = ["open", "accepted", "in_progress", "pending_confirmation"];
    const HISTORY_STATUSES: RequestStatus[] = ["completed", "cancelled"];

    const list = requests.filter((r) =>
        tab === "active" ? ACTIVE_STATUSES.includes(r.status) : HISTORY_STATUSES.includes(r.status)
    );

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center">
                <span className="text-5xl mb-4">🔒</span>
                <p className="text-base font-bold text-slate-700">Inicia sesión para ver tus solicitudes</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-full bg-[#f8fafc]">
            {/* Header */}
            <div className="bg-white px-4 pt-5 pb-3 border-b border-slate-100">
                <h1 className="text-xl font-bold text-slate-900">Mis Solicitudes</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                    {loading ? "Cargando..." : `${list.length} solicitud${list.length !== 1 ? "es" : ""} ${tab === "active" ? "activas" : "en historial"}`}
                </p>

                {/* Tabs */}
                <div className="flex gap-1 mt-3 p-1 bg-slate-100 rounded-2xl">
                    {(["active", "history"] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={cn(
                                "flex-1 py-2 rounded-xl text-sm font-semibold transition-all",
                                tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                            )}
                        >
                            {t === "active" ? "Activas" : "Historial"}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 px-4 py-4 space-y-3">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-[#34af00] animate-spin" />
                    </div>
                ) : list.length > 0 ? (
                    list.map((req) => (
                        <RequestCard
                            key={req.id}
                            req={req}
                            userId={user.uid}
                            onViewOffers={() => setOffersTarget(req)}
                            onCancel={() => setCancelTarget(req)}
                            onConfirm={() => setConfirmTarget(req)}
                            onRate={() => setRatingTarget(req)}
                            onChat={() => router.push(`/dashboard/chat?id=${req.id}`)}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-4">
                            <PackageOpen className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-base font-bold text-slate-700">
                            {tab === "active" ? "Sin solicitudes activas" : "Sin historial aún"}
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                            {tab === "active" ? "Busca un experto y solicita un servicio 🔍" : "Aquí verás tus trabajos completados"}
                        </p>
                        {tab === "active" && (
                            <button
                                onClick={() => router.push("/search")}
                                className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#34af00] text-white text-sm font-bold transition-all active:scale-95"
                            >
                                <Search className="w-4 h-4" /> Buscar expertos
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* FAB */}
            <button
                onClick={() => router.push("/dashboard/requests/new")}
                className="fixed bottom-24 right-5 z-30 w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all active:scale-90"
                style={{ background: "linear-gradient(135deg, #34af00, #2d9600)", boxShadow: "0 4px 20px rgba(52,175,0,.4)" }}
                aria-label="Nueva solicitud"
            >
                <Plus className="w-7 h-7 text-white" />
            </button>

            {/* Sheets & Modals */}
            {offersTarget && (
                <OffersSheet
                    req={offersTarget}
                    onClose={() => setOffersTarget(null)}
                    onAccepted={() => setOffersTarget(null)}
                />
            )}
            {cancelTarget && (
                <CancelSheet req={cancelTarget} onClose={() => setCancelTarget(null)} />
            )}
            {confirmTarget && (
                <ConfirmSheet req={confirmTarget} onClose={() => setConfirmTarget(null)} />
            )}
            {ratingTarget && (
                <RatingModal
                    req={ratingTarget}
                    clientId={user.uid}
                    onClose={() => setRatingTarget(null)}
                    onDone={() => setRatingTarget(null)}
                />
            )}
        </div>
    );
}
