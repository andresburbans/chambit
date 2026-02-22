"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

// Using the static catalog from the wizard for categories
import categoriesCatalog from "@/lib/categories-catalog.json";

export default function ExpertOnboardingPage() {
    const { firebaseUser, user, refreshProfile, loading } = useAuth();
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false);

    // Profile data
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [bio, setBio] = useState("");

    // Services data
    const [categoryId, setCategoryId] = useState("");
    const [subcategoryId, setSubcategoryId] = useState("");
    const [priceMin, setPriceMin] = useState(20000);

    const categories = Array.from(new Set(categoriesCatalog.map(c => JSON.stringify({ id: c.categoryId, name: c.categoryName }))))
        .map(str => JSON.parse(str));
    const subcategories = categoriesCatalog.filter(c => c.categoryId === categoryId);

    useEffect(() => {
        if (!loading && firebaseUser) {
            setName(firebaseUser.displayName || "");
        }
    }, [firebaseUser, loading]);

    const handleSaveExpert = async () => {
        if (!firebaseUser) return;
        setIsSaving(true);
        try {
            const catName = categories.find(c => c.id === categoryId)?.name || "";
            const subName = subcategories.find(s => s.id === subcategoryId)?.name || "";

            await setDoc(doc(db, "users", firebaseUser.uid), {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: name,
                firstName: name.trim().split(" ")[0] || "",
                lastName: name.trim().split(" ").slice(1).join(" "),
                phone: phone,
                cc: user?.cc ?? "",
                birthYear: user?.birthYear ?? 0,
                role: "both", // allow them to also be clients
                avatarUrl: user?.avatarUrl || firebaseUser.photoURL || "",
                h3Res9: user?.h3Res9 || "",
                country: "CO",
                fcmToken: user?.fcmToken || "",
                preferredCategories: user?.preferredCategories || [],
                expertPopupDismissals: user?.expertPopupDismissals ?? 0,
                isExpertEnabled: user?.isExpertEnabled ?? true,
                createdAt: user?.createdAt ?? serverTimestamp(),
                lastActiveAt: serverTimestamp(),
                expert: {
                    categoryId,
                    categoryName: catName,
                    subcategoryId,
                    subcategoryName: subName,
                    priceMin,
                    priceMid: priceMin * 1.5,
                    priceMax: priceMin * 2,
                    priceHour: priceMin,
                    educationLevel: "tecnico",
                    rating: 5.0,
                    ratingRaw: 5.0,
                    ratingCount: 0,
                    wilsonLB: 0,
                    wilsonPositiveSum: 0,
                    wilsonNegativeSum: 0,
                    isActive: true,
                    lastActiveAt: new Date(),
                    h3Index: "",
                    coverageRadiusKm: 5,
                    completedJobs: 0,
                    verified: false,
                    bio: bio || "Experto comprometido con brindar el mejor servicio.",
                }
            }, { merge: true });
            await refreshProfile();
            router.push("/dashboard");
        } catch (error) {
            console.error(error);
            setIsSaving(false);
        }
    };

    if (loading || !firebaseUser) return null;

    return (
        <div className="min-h-screen flex flex-col bg-[#f8fafc] px-6 py-10 md:py-20 mx-auto max-w-lg">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => step > 1 ? setStep(step - 1) : router.back()}
                    className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center transition-colors hover:bg-slate-50"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Paso {step} de 3</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#34af00] transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
                    </div>
                </div>
            </div>

            {/* Step 1: Personal Data */}
            {step === 1 && (
                <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
                    <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Tus datos</h1>
                    <p className="text-slate-500 mb-8 text-sm">Información básica para tu perfil profesional.</p>

                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700">Nombre público</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-14 bg-white border border-slate-200 rounded-2xl px-4 outline-none focus:border-[#34af00] focus:ring-1 focus:ring-[#34af00] transition-all"
                                placeholder="Ej. Juan Pérez"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700">Teléfono (WhatsApp)</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full h-14 bg-white border border-slate-200 rounded-2xl px-4 outline-none focus:border-[#34af00] focus:ring-1 focus:ring-[#34af00] transition-all"
                                placeholder="Ej. 300 123 4567"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700">Sobre ti (Bio)</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full h-24 py-3 bg-white border border-slate-200 rounded-2xl px-4 outline-none focus:border-[#34af00] focus:ring-1 focus:ring-[#34af00] transition-all resize-none"
                                placeholder="Describe brevemente tu experiencia y especialidad."
                            />
                        </div>
                    </div>

                    <button
                        disabled={!name || !phone}
                        onClick={() => setStep(2)}
                        className="w-full mt-10 h-14 rounded-2xl font-bold text-white flex items-center justify-center transition-all disabled:opacity-50"
                        style={{ background: "linear-gradient(135deg, #34af00, #2d9600)" }}
                    >
                        Siguiente
                    </button>
                </div>
            )}

            {/* Step 2: Service Selection */}
            {step === 2 && (
                <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
                    <h1 className="text-2xl font-extrabold text-slate-900 mb-2">¿Qué servicio ofreces?</h1>
                    <p className="text-slate-500 mb-8 text-sm">Selecciona tu especialidad principal.</p>

                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700">Categoría principal</label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full h-14 bg-white border border-slate-200 rounded-2xl px-4 outline-none focus:border-[#34af00] focus:ring-1 focus:ring-[#34af00]"
                            >
                                <option value="" disabled>Selecciona una categoría</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        {categoryId && (
                            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                                <label className="text-sm font-bold text-slate-700">Subcategoría (Especialidad)</label>
                                <select
                                    value={subcategoryId}
                                    onChange={(e) => setSubcategoryId(e.target.value)}
                                    className="w-full h-14 bg-white border border-slate-200 rounded-2xl px-4 outline-none focus:border-[#34af00] focus:ring-1 focus:ring-[#34af00]"
                                >
                                    <option value="" disabled>Selecciona tu especialidad</option>
                                    {subcategories.map((s) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <button
                        disabled={!categoryId || !subcategoryId}
                        onClick={() => setStep(3)}
                        className="w-full mt-10 h-14 rounded-2xl font-bold text-white flex items-center justify-center transition-all disabled:opacity-50"
                        style={{ background: "linear-gradient(135deg, #34af00, #2d9600)" }}
                    >
                        Siguiente
                    </button>
                </div>
            )}

            {/* Step 3: Pricing and Confirmation */}
            {step === 3 && (
                <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
                    <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Tarifa base</h1>
                    <p className="text-slate-500 mb-8 text-sm">Establece un precio estimado por hora o por visita (podrás negociarlo después).</p>

                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700">Precio base estimado (COP)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                <input
                                    type="number"
                                    value={priceMin}
                                    onChange={(e) => setPriceMin(parseInt(e.target.value) || 0)}
                                    className="w-full h-14 bg-white border border-slate-200 rounded-2xl pl-8 pr-4 outline-none focus:border-[#34af00] focus:ring-1 focus:ring-[#34af00] transition-all font-bold text-lg"
                                />
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-green-50 border border-green-100 flex gap-3 text-sm text-green-800">
                            <CheckCircle2 className="w-5 h-5 text-[#34af00] shrink-0" />
                            <p>¡Todo listo para empezar a recibir solicitudes de clientes cercanos!</p>
                        </div>
                    </div>

                    <button
                        disabled={isSaving || priceMin < 5000}
                        onClick={handleSaveExpert}
                        className="w-full mt-10 h-14 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        style={{ background: "linear-gradient(135deg, #34af00, #2d9600)", boxShadow: "0 4px 20px rgba(52,175,0,.3)" }}
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publicar mi perfil y entrar"}
                    </button>
                </div>
            )}
        </div>
    );
}
