"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import categories from "@/lib/categories-catalog.json";
import {
    ArrowLeft, ArrowRight, ChevronDown, MapPin,
    DollarSign, Clock, Loader2, CheckCircle, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CatalogItem {
    id: string;
    name: string;
    categoryId: string;
    categoryName: string;
}

const catalog = categories as CatalogItem[];

// Derive unique categories from catalog
const CATEGORIES = Array.from(
    new Map(catalog.map((c) => [c.categoryId, { id: c.categoryId, name: c.categoryName }])).values()
);

const URGENCY_OPTIONS = [
    { id: "flexible", label: "Flexible", desc: "En los próximos días" },
    { id: "soon", label: "Pronto", desc: "En las próximas 24–48h" },
    { id: "urgent", label: "Urgente", desc: "Lo antes posible" },
];

const BUDGET_OPTIONS = [
    { id: "range_0", label: "Menor de $50.000", min: 0, max: 50000 },
    { id: "range_1", label: "$50.000 – $100.000", min: 50000, max: 100000 },
    { id: "range_2", label: "$100.000 – $200.000", min: 100000, max: 200000 },
    { id: "range_3", label: "$200.000 – $500.000", min: 200000, max: 500000 },
    { id: "range_4", label: "Más de $500.000", min: 500000, max: null },
    { id: "negotiate", label: "A convenir con el experto", min: null, max: null },
];

// ─── Step components ──────────────────────────────────────────────────────────

function StepHeader({ step, total }: { step: number; total: number }) {
    return (
        <div className="px-4 pt-5 pb-3">
            {/* Progress dots */}
            <div className="flex gap-1.5 mb-4">
                {Array.from({ length: total }).map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            i < step ? "bg-[#34af00] flex-1" : i === step - 1 ? "bg-[#34af00] flex-1" : "bg-slate-200 flex-1"
                        )}
                    />
                ))}
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Paso {step} de {total}
            </p>
        </div>
    );
}

// Step 1: Category + Subcategory
function Step1({
    catId, setCatId, subId, setSubId,
}: {
    catId: string; setCatId: (v: string) => void;
    subId: string; setSubId: (v: string) => void;
}) {
    const subs = catalog.filter((c) => c.categoryId === catId);

    return (
        <div className="px-4 space-y-4">
            <div>
                <h2 className="text-xl font-bold text-slate-900">¿Qué tipo de servicio necesitas?</h2>
                <p className="text-sm text-slate-500 mt-1">Selecciona la categoría y el servicio específico.</p>
            </div>

            {/* Category select */}
            <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Categoría</label>
                <div className="relative">
                    <select
                        value={catId}
                        onChange={(e) => { setCatId(e.target.value); setSubId(""); }}
                        className="w-full appearance-none px-4 py-3 pr-10 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-900 outline-none focus:border-[#34af00] focus:bg-white transition-colors"
                    >
                        <option value="">Selecciona una categoría...</option>
                        {CATEGORIES.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* Subcategory grid */}
            {catId && (
                <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Servicio específico</label>
                    <div className="grid grid-cols-2 gap-2">
                        {subs.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setSubId(s.id)}
                                className={cn(
                                    "p-3 rounded-2xl border text-left text-sm font-medium transition-all active:scale-95",
                                    subId === s.id
                                        ? "border-[#34af00] bg-green-50 text-[#34af00]"
                                        : "border-slate-200 bg-white text-slate-700"
                                )}
                            >
                                {s.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Step 2: Description + Urgency
function Step2({
    description, setDescription,
    urgency, setUrgency,
}: {
    description: string; setDescription: (v: string) => void;
    urgency: string; setUrgency: (v: string) => void;
}) {
    return (
        <div className="px-4 space-y-5">
            <div>
                <h2 className="text-xl font-bold text-slate-900">Cuéntanos más</h2>
                <p className="text-sm text-slate-500 mt-1">Más detalles → mejores ofertas de los expertos.</p>
            </div>

            {/* Description */}
            <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Descripción del trabajo</label>
                <textarea
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ej: Necesito cambiar 3 tomas corrientes en sala y cocina. El apartamento es en tercer piso, tengo los materiales..."
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#34af00] focus:bg-white transition-colors resize-none"
                />
                <p className="text-xs text-slate-400 mt-1 text-right">{description.length}/500</p>
            </div>

            {/* Urgency */}
            <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> ¿Cuándo lo necesitas?
                </label>
                <div className="space-y-2">
                    {URGENCY_OPTIONS.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => setUrgency(opt.id)}
                            className={cn(
                                "w-full flex items-center justify-between px-4 py-3 rounded-2xl border text-left transition-all active:scale-[0.98]",
                                urgency === opt.id
                                    ? "border-[#34af00] bg-green-50"
                                    : "border-slate-200 bg-white"
                            )}
                        >
                            <div>
                                <p className={cn("text-sm font-bold", urgency === opt.id ? "text-[#34af00]" : "text-slate-900")}>
                                    {opt.label}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                            </div>
                            {urgency === opt.id && <CheckCircle className="w-5 h-5 text-[#34af00] shrink-0" />}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Step 3: Budget + Location (confirm)
function Step3({
    budgetId, setBudgetId,
    location,
}: {
    budgetId: string; setBudgetId: (v: string) => void;
    location: string;
}) {
    return (
        <div className="px-4 space-y-5">
            <div>
                <h2 className="text-xl font-bold text-slate-900">Presupuesto y ubicación</h2>
                <p className="text-sm text-slate-500 mt-1">Los expertos ven esto para hacer ofertas ajustadas.</p>
            </div>

            {/* Budget */}
            <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" /> Presupuesto estimado
                </label>
                <div className="space-y-2">
                    {BUDGET_OPTIONS.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => setBudgetId(opt.id)}
                            className={cn(
                                "w-full flex items-center justify-between px-4 py-3 rounded-2xl border text-left transition-all active:scale-[0.98]",
                                budgetId === opt.id
                                    ? "border-[#34af00] bg-green-50"
                                    : "border-slate-200 bg-white"
                            )}
                        >
                            <p className={cn("text-sm font-semibold", budgetId === opt.id ? "text-[#34af00]" : "text-slate-700")}>
                                {opt.label}
                            </p>
                            {budgetId === opt.id && <CheckCircle className="w-5 h-5 text-[#34af00] shrink-0" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Location (read-only from user profile) */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200">
                <MapPin className="w-4 h-4 text-[#34af00] shrink-0" />
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tu ubicación</p>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">{location || "Cali, Colombia"}</p>
                    <p className="text-xs text-slate-400">Solo comparte tu barrio con los expertos seleccionados.</p>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NewRequestPage() {
    const { user } = useAuth();
    const router = useRouter();

    // Form state
    const [step, setStep] = useState(1);
    const [catId, setCatId] = useState("");
    const [subId, setSubId] = useState("");
    const [description, setDescription] = useState("");
    const [urgency, setUrgency] = useState("");
    const [budgetId, setBudgetId] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");

    const TOTAL_STEPS = 3;

    const canNext = () => {
        if (step === 1) return catId !== "" && subId !== "";
        if (step === 2) return description.trim().length >= 20 && urgency !== "";
        if (step === 3) return budgetId !== "";
        return false;
    };

    const subItem = catalog.find((c) => c.id === subId);
    const budgetOpt = BUDGET_OPTIONS.find((b) => b.id === budgetId);

    const handleSubmit = async () => {
        if (!user) { setError("Debes iniciar sesión."); return; }
        setSubmitting(true);
        setError("");
        try {
            await addDoc(collection(db, "requests"), {
                clientId: user.uid,
                clientName: user.displayName || "Cliente",
                categoryId: catId,
                subcategoryId: subId,
                subcategoryName: subItem?.name ?? "",
                description: description.trim(),
                urgency,
                budgetLabel: budgetOpt?.label ?? "A convenir",
                budgetMin: budgetOpt?.min ?? null,
                budgetMax: budgetOpt?.max ?? null,
                geozoneId: user.geozoneId ?? "",
                h3Res9: user.h3Res9 ?? "",
                status: "open",
                offerCount: 0,
                createdAt: serverTimestamp(),
                expiresAt: null, // set by CF after 72h
            });
            setDone(true);
        } catch (e) {
            setError("Error al publicar. Inténtalo de nuevo.");
        } finally {
            setSubmitting(false);
        }
    };

    // ── Success screen ──
    if (done) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center">
                <div className="w-20 h-20 rounded-3xl bg-green-50 flex items-center justify-center mb-5">
                    <CheckCircle className="w-10 h-10 text-[#34af00]" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">¡Solicitud publicada!</h2>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    Los expertos disponibles en tu zona recibirán tu solicitud.<br />
                    Te notificaremos cuando haya ofertas.
                </p>
                <button
                    onClick={() => router.push("/dashboard/requests")}
                    className="mt-8 w-full h-13 rounded-2xl font-bold text-white transition-all active:scale-95"
                    style={{ background: "linear-gradient(135deg, #34af00, #2d9600)", height: "52px" }}
                >
                    Ver mis solicitudes
                </button>
                <button
                    onClick={() => router.push("/")}
                    className="mt-3 w-full h-12 rounded-2xl font-semibold text-slate-600 bg-slate-100 transition-all active:scale-95"
                >
                    Volver al inicio
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Top bar */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-2 border-b border-slate-100">
                <button
                    onClick={() => step === 1 ? router.back() : setStep(step - 1)}
                    className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center transition-all active:scale-90"
                >
                    <ArrowLeft className="w-4 h-4 text-slate-700" />
                </button>
                <h1 className="text-base font-bold text-slate-900">Nueva solicitud</h1>
            </div>

            {/* Progress */}
            <StepHeader step={step} total={TOTAL_STEPS} />

            {/* Step content */}
            <div className="flex-1 overflow-y-auto py-2">
                {step === 1 && <Step1 catId={catId} setCatId={setCatId} subId={subId} setSubId={setSubId} />}
                {step === 2 && <Step2 description={description} setDescription={setDescription} urgency={urgency} setUrgency={setUrgency} />}
                {step === 3 && <Step3 budgetId={budgetId} setBudgetId={setBudgetId} location={user?.displayName ? "Cali, Colombia" : ""} />}
            </div>

            {/* Error */}
            {error && (
                <div className="mx-4 mb-2 flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 border border-red-200">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="text-sm text-red-600">{error}</span>
                </div>
            )}

            {/* CTA */}
            <div className="px-4 py-4 border-t border-slate-100" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}>
                {step < TOTAL_STEPS ? (
                    <button
                        onClick={() => setStep(step + 1)}
                        disabled={!canNext()}
                        className="w-full h-[52px] rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40"
                        style={{ background: "linear-gradient(135deg, #34af00, #2d9600)" }}
                    >
                        Continuar <ArrowRight className="w-5 h-5" />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={!canNext() || submitting}
                        className="w-full h-[52px] rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40"
                        style={{ background: "linear-gradient(135deg, #34af00, #2d9600)" }}
                    >
                        {submitting
                            ? <><Loader2 className="w-5 h-5 animate-spin" /> Publicando...</>
                            : "Publicar solicitud 🚀"}
                    </button>
                )}
            </div>
        </div>
    );
}
