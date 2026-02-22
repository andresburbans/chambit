"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, Loader2, DollarSign, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import {
    collection, query, orderBy, onSnapshot,
    doc, getDoc, addDoc, serverTimestamp, Timestamp,
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatRequest {
    id: string;
    clientId: string;
    clientName: string;
    acceptedExpertId?: string;
    acceptedExpertName?: string;
    subcategoryName: string;
    status: string;
    acceptedPrice?: number;
}

interface Message {
    id: string;
    senderId: string;
    senderName: string;
    role: "client" | "expert";
    type: "text" | "price_proposal" | "system";
    text?: string;
    proposedPrice?: number;
    proposalStatus?: "pending" | "accepted" | "rejected";
    createdAt: Timestamp | null;
}

// ─── Price Proposal Bubble ────────────────────────────────────────────────────

function PriceProposal({ msg, isMine }: { msg: Message; isMine: boolean }) {
    return (
        <div className={cn(
            "max-w-[80%] rounded-2xl border p-3",
            isMine ? "ml-auto bg-[#34af00]/10 border-[#34af00]/30" : "mr-auto bg-white border-slate-200 shadow-sm"
        )}>
            <div className="flex items-center gap-2 mb-1.5">
                <DollarSign className="w-4 h-4 text-[#34af00]" />
                <span className="text-xs font-bold text-slate-700">Propuesta de precio</span>
            </div>
            <p className="text-lg font-extrabold text-[#34af00]">${msg.proposedPrice?.toLocaleString()}</p>
            {msg.proposalStatus === "pending" && !isMine && (
                <p className="text-[10px] text-slate-500 mt-1">Pendiente de respuesta</p>
            )}
        </div>
    );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function Bubble({ msg, isMine }: { msg: Message; isMine: boolean }) {
    const time = msg.createdAt
        ? formatDistanceToNow(msg.createdAt.toDate(), { locale: es, addSuffix: true })
        : "";

    if (msg.type === "system") {
        return (
            <div className="flex justify-center my-2">
                <span className="text-[10px] text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{msg.text}</span>
            </div>
        );
    }

    if (msg.type === "price_proposal") {
        return (
            <div className={cn("flex flex-col mb-3", isMine ? "items-end" : "items-start")}>
                <PriceProposal msg={msg} isMine={isMine} />
                {time && <span className="text-[10px] text-slate-400 mt-1 px-1">{time}</span>}
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col mb-2", isMine ? "items-end" : "items-start")}>
            {!isMine && <span className="text-[10px] text-slate-400 mb-0.5 ml-1">{msg.senderName}</span>}
            <div className={cn(
                "max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                isMine
                    ? "rounded-br-md bg-[#34af00] text-white"
                    : "rounded-bl-md bg-white text-slate-900 shadow-sm border border-slate-100"
            )}>
                {msg.text}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 px-1">{time}</span>
        </div>
    );
}

// ─── Price Proposal Sheet ─────────────────────────────────────────────────────

function PriceSheet({ requestId, senderId, senderName, role, onClose }: {
    requestId: string; senderId: string; senderName: string; role: "client" | "expert"; onClose: () => void;
}) {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        const n = Number(amount);
        if (!n || n <= 0) return;
        setLoading(true);
        try {
            await addDoc(collection(db, `requests/${requestId}/messages`), {
                senderId, senderName, role,
                type: "price_proposal", proposedPrice: n, proposalStatus: "pending",
                createdAt: serverTimestamp(),
            });
            onClose();
        } finally { setLoading(false); }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
            <div
                className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl p-5"
                style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)", animation: "slideUp .25s ease" }}
            >
                <div className="flex justify-center mb-4"><div className="w-10 h-1 bg-slate-200 rounded-full" /></div>
                <h3 className="text-base font-bold text-slate-900 mb-4">Proponer un precio</h3>
                <div className="relative mb-4">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                    <input
                        type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                        placeholder="80,000" autoFocus
                        className="w-full pl-8 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-[#34af00]"
                    />
                </div>
                <button
                    onClick={handleSend} disabled={loading}
                    className="w-full h-12 rounded-2xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #34af00, #2d9600)" }}
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}
                    Enviar propuesta
                </button>
            </div>
            <style jsx>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
        </>
    );
}

// ─── Chat Inner (uses searchParams) ──────────────────────────────────────────

function ChatInner() {
    const searchParams = useSearchParams();
    const requestId = searchParams.get("id") ?? "";
    const router = useRouter();
    const { user } = useAuth();

    const [request, setRequest] = useState<ChatRequest | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [showPriceSheet, setShowPriceSheet] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!requestId) { setLoading(false); return; }
        getDoc(doc(db, "requests", requestId)).then((snap) => {
            if (snap.exists()) setRequest({ id: snap.id, ...snap.data() } as ChatRequest);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [requestId]);

    useEffect(() => {
        if (!requestId) return;
        const q = query(collection(db, `requests/${requestId}/messages`), orderBy("createdAt", "asc"));
        return onSnapshot(q, (snap) => {
            setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Message)));
        });
    }, [requestId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const isClient = user?.uid === request?.clientId;
    const isExpert = user?.uid === request?.acceptedExpertId;
    const hasAccess = isClient || isExpert;
    const myRole: "client" | "expert" = isClient ? "client" : "expert";

    const sendMessage = async () => {
        const t = text.trim();
        if (!t || !user || !requestId) return;
        setSending(true);
        setText("");
        try {
            await addDoc(collection(db, `requests/${requestId}/messages`), {
                senderId: user.uid, senderName: user.displayName ?? "Usuario",
                role: myRole, type: "text", text: t, createdAt: serverTimestamp(),
            });
        } finally { setSending(false); }
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center">
                <span className="text-5xl mb-4">🔒</span>
                <p className="font-bold text-slate-700">Inicia sesión para acceder al chat</p>
            </div>
        );
    }

    if (!loading && request && !hasAccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center">
                <span className="text-5xl mb-4">🚫</span>
                <p className="font-bold text-slate-700">Sin acceso a este chat</p>
                <p className="text-sm text-slate-400 mt-1">Solo las partes vinculadas pueden chatear.</p>
            </div>
        );
    }

    if (!loading && !requestId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center">
                <span className="text-5xl mb-4">❓</span>
                <p className="font-bold text-slate-700">Chat no encontrado</p>
            </div>
        );
    }

    const otherName = isClient ? (request?.acceptedExpertName ?? "Experto") : (request?.clientName ?? "Cliente");

    return (
        <div className="flex flex-col h-screen bg-[#f8fafc] overflow-hidden">
            <div className="bg-white border-b border-slate-100 px-4 py-3 shrink-0 flex items-center gap-3">
                <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <ArrowLeft className="w-4 h-4 text-slate-700" />
                </button>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#34af00] to-[#2d9600] flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {otherName?.[0] ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{otherName}</p>
                    <p className="text-[11px] text-slate-500 truncate">
                        {request?.subcategoryName ?? "Cargando..."}
                        {request?.acceptedPrice ? ` · $${request.acceptedPrice.toLocaleString()}` : ""}
                    </p>
                </div>
                <button onClick={() => setShowPriceSheet(true)} className="w-9 h-9 rounded-xl bg-green-50 border border-[#34af00]/30 flex items-center justify-center shrink-0" title="Proponer precio">
                    <DollarSign className="w-4 h-4 text-[#34af00]" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
                {loading ? (
                    <div className="flex items-center justify-center h-full"><Loader2 className="w-6 h-6 text-[#34af00] animate-spin" /></div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-14 h-14 rounded-3xl bg-green-50 flex items-center justify-center mb-3">
                            <MessageCircle className="w-7 h-7 text-[#34af00]" />
                        </div>
                        <p className="text-sm font-bold text-slate-700">¡Chatea con {otherName}!</p>
                        <p className="text-xs text-slate-400 mt-1">Coordina horarios, materiales y detalles.</p>
                    </div>
                ) : messages.map((msg) => (
                    <Bubble key={msg.id} msg={msg} isMine={msg.senderId === user.uid} />
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="bg-white border-t border-slate-100 px-4 py-3 shrink-0" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}>
                <div className="flex items-end gap-2">
                    <div className="flex-1 min-h-[44px] max-h-32 flex items-center px-4 rounded-2xl bg-slate-100">
                        <textarea
                            rows={1} value={text}
                            onChange={(e) => { setText(e.target.value); e.target.style.height = "auto"; e.target.style.height = `${e.target.scrollHeight}px`; }}
                            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                            placeholder="Escribe un mensaje..."
                            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none resize-none py-2.5 max-h-28"
                            style={{ overflowY: "auto" }}
                        />
                    </div>
                    <button
                        onClick={sendMessage} disabled={!text.trim() || sending}
                        className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all active:scale-90 disabled:opacity-40"
                        style={{ background: text.trim() ? "linear-gradient(135deg, #34af00, #2d9600)" : "#e2e8f0" }}
                    >
                        {sending ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className={cn("w-4 h-4", text.trim() ? "text-white" : "text-slate-400")} />}
                    </button>
                </div>
            </div>

            {showPriceSheet && user && requestId && (
                <PriceSheet requestId={requestId} senderId={user.uid} senderName={user.displayName ?? "Usuario"} role={myRole} onClose={() => setShowPriceSheet(false)} />
            )}
        </div>
    );
}

// ─── Static Page (no dynamic params) ─────────────────────────────────────────

export default function ChatPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen">
                <div className="w-8 h-8 rounded-full border-4 border-[#34af00] border-t-transparent animate-spin" />
            </div>
        }>
            <ChatInner />
        </Suspense>
    );
}
