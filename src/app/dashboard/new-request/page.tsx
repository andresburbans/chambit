"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { ArrowLeft, CheckCircle2, ChevronRight, Loader2, MapPin } from "lucide-react";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Local import from the generated catalog (or we could fetch from Firestore if it were dynamic)
import catalogData from "@/lib/categories-catalog.json";

// Categories grouped for Step 1
const CATEGORIES: { id: string; label: string; emoji: string; color: string }[] = [
    { id: "cat-reparacion", label: "Reparación", emoji: "🔧", color: "#FFF3E0" },
    { id: "cat-construccion", label: "Construcción", emoji: "🏗️", color: "#E8F5E9" },
    { id: "cat-limpieza", label: "Limpieza", emoji: "✨", color: "#E3F2FD" },
    { id: "cat-cuidado", label: "Cuidado", emoji: "💚", color: "#FCE4EC" },
    { id: "cat-belleza", label: "Belleza", emoji: "💅", color: "#F3E5F5" },
    { id: "cat-mecanica", label: "Mecánica", emoji: "🚗", color: "#E0F7FA" },
    { id: "cat-instalaciones", label: "Instalaciones", emoji: "🔌", color: "#F3E5F5" },
    { id: "cat-tecnologia", label: "Tecnología", emoji: "💻", color: "#EDE7F6" },
];

export default function NewRequestPage() {
    const router = useRouter();
    const { user } = useAuth();

    const [step, setStep] = useState(1);

    // Form state
    const [selectedCatId, setSelectedCatId] = useState("");
    const [selectedSubId, setSelectedSubId] = useState("");
    const [description, setDescription] = useState("");
    const [urgency, setUrgency] = useState<"alta" | "normal" | "baja">("normal");
    const [budgetLabel, setBudgetLabel] = useState("$20.000 - $50.000");

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Derived data
    const subcategories = catalogData.filter((s) => s.categoryId === selectedCatId);
    const selectedCat = CATEGORIES.find(c => c.id === selectedCatId);
    const selectedSub = catalogData.find(s => s.id === selectedSubId);

    // Redirect if not logged in (handled by layout ideally, but safe check here)
    if (!user) return <div className="p-8 text-center">Cargando...</div>;

    const handleSubmit = async () => {
        if (!user || !selectedCat || !selectedSub || !description) return;
        setIsSubmitting(true);

        try {
            const reqRef = doc(collection(db, "requests"));
            const requestId = reqRef.id;

            await setDoc(reqRef, {
                id: requestId,
                clientId: user.uid,
                clientName: user.displayName || "Usuario",
                categoryId: selectedCat.id,
                categoryName: selectedCat.label,
                subcategoryId: selectedSub.id,
                subcategoryName: selectedSub.name,
                description,
                urgency,
                budgetLabel,
                status: "open",
                offerCount: 0,
                h3Res9: user.h3Res9 || "",
                geozoneId: user.geozoneId || "cali-urban-v1",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            // Redirect to the open requests view after successful creation
            router.replace("/dashboard/open-requests?created=true");
        } catch (error) {
            console.error("Error creating request:", error);
            alert("Hubo un error al publicar tu solicitud.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] md:bg-white md:max-w-2xl md:mx-auto md:border-x md:border-slate-100 flex flex-col">

            {/* Header */}
            <header className="bg-white px-4 h-14 flex items-center border-b border-slate-100 sticky top-0 z-10">
                <button
                    onClick={() => step > 1 ? setStep(step - 1) : router.back()}
                    className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-700" />
                </button>
                <div className="flex-1 text-center pr-8"> // padding to offset back button
                    <h1 className="text-base font-bold text-slate-800">
                        {step === 1 ? "¿Qué necesitas?" : step === 2 ? "Subcategoría" : "Detalles del servicio"}
                    </h1>
                </div>
            </header>

            {/* Progress Bar */}
            <div className="bg-slate-100 h-1 w-full">
                <div
                    className="h-1 bg-[#34af00] transition-all duration-300"
                    style={{ width: `${(step / 3) * 100}%` }}
                />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-4 pb-24">

                {/* STEP 1: Categories */}
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <p className="text-slate-500 text-sm mb-4">Selecciona la categoría principal del servicio que estás buscando.</p>
                        <div className="grid grid-cols-2 gap-3">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        setSelectedCatId(cat.id);
                                        setStep(2);
                                    }}
                                    className="flex flex-col items-center justify-center p-5 rounded-2xl border border-slate-100 bg-white hover:border-[#34af00] hover:shadow-md transition-all active:scale-95"
                                >
                                    <span className="text-4xl mb-3 p-3 rounded-full" style={{ backgroundColor: cat.color }}>
                                        {cat.emoji}
                                    </span>
                                    <span className="font-bold text-slate-800 text-sm">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 2: Subcategories */}
                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden mb-6">
                            {subcategories.map((sub, idx) => (
                                <button
                                    key={sub.id}
                                    onClick={() => {
                                        setSelectedSubId(sub.id);
                                        setStep(3);
                                    }}
                                    className={`w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 active:bg-slate-100 transition-colors ${idx !== subcategories.length - 1 ? 'border-b border-slate-100' : ''}`}
                                >
                                    <span className="font-medium text-slate-800">{sub.name}</span>
                                    <ChevronRight className="w-5 h-5 text-slate-300" />
                                </button>
                            ))}
                            {subcategories.length === 0 && (
                                <div className="p-8 text-center text-slate-500 text-sm">
                                    No hay subcategorías disponibles.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* STEP 3: Details */}
                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">

                        {/* Summary of Selection */}
                        <div className="bg-green-50 rounded-2xl p-4 flex items-center gap-3">
                            <span className="text-3xl bg-white rounded-xl p-2 shadow-sm">{selectedCat?.emoji}</span>
                            <div>
                                <p className="text-xs font-bold text-[#34af00] uppercase tracking-wide">{selectedCat?.label}</p>
                                <p className="font-bold text-slate-900">{selectedSub?.name}</p>
                            </div>
                        </div>

                        {/* Location Alert */}
                        {!user.h3Res9 && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
                                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                <div className="text-xs text-amber-800">
                                    <strong>No has configurado tu ubicación.</strong> Tu solicitud se publicará en "Cali", pero los expertos no sabrán de qué zona eres hasta que arregles el servicio. (Puedes configurar tu ubicación en el perfil).
                                </div>
                            </div>
                        )}

                        {/* Description field */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-800">Describe lo que necesitas</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Ej: Necesito arreglar una fuga debajo del lavaplatos que está mojando todo el piso. Es urgente..."
                                className="w-full h-32 rounded-2xl border-slate-200 bg-white px-4 py-3 text-sm focus:border-[#34af00] focus:ring-[#34af00] resize-none"
                            />
                            <p className="text-[11px] text-slate-500">Sé lo más detallado posible para recibir mejores cotizaciones.</p>
                        </div>

                        {/* Urgency */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-800">Nivel de Urgencia</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(["baja", "normal", "alta"] as const).map((u) => (
                                    <button
                                        key={u}
                                        onClick={() => setUrgency(u)}
                                        className={`py-2 rounded-xl text-xs font-bold capitalize transition-all border ${urgency === u
                                                ? u === "alta" ? "bg-red-50 text-red-600 border-red-200"
                                                    : u === "normal" ? "bg-blue-50 text-blue-600 border-blue-200"
                                                        : "bg-green-50 text-green-600 border-green-200"
                                                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                                            }`}
                                    >
                                        {u}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Expected Budget (informative only for now) */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-800">Presupuesto esperado (informativo)</label>
                            <select
                                value={budgetLabel}
                                onChange={(e) => setBudgetLabel(e.target.value)}
                                className="w-full h-12 rounded-xl border-slate-200 bg-white px-4 text-sm focus:border-[#34af00] focus:ring-[#34af00]"
                            >
                                <option value="Menos de $20.000">Menos de $20.000</option>
                                <option value="$20.000 - $50.000">$20.000 - $50.000</option>
                                <option value="$50.000 - $100.000">$50.000 - $100.000</option>
                                <option value="$100.000 - $300.000">$100.000 - $300.000</option>
                                <option value="Más de $300.000">Más de $300.000</option>
                                <option value="No estoy seguro">No estoy seguro, necesito cotización</option>
                            </select>
                        </div>
                    </div>
                )}
            </main>

            {/* Bottom Sticky Action Bar */}
            {step === 3 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 md:absolute md:rounded-b-2xl">
                    <button
                        onClick={handleSubmit}
                        disabled={!description.trim() || isSubmitting}
                        className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 font-bold text-white transition-all disabled:opacity-50 disabled:active:scale-100 active:scale-95"
                        style={{ background: "linear-gradient(135deg, #34af00, #2d9600)" }}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> Publicando...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-5 h-5" /> Publicar Solicitud
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
