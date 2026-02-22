"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Briefcase, User as UserIcon, Loader2, ArrowRight } from "lucide-react";
import { Logo } from "@/components/layout/logo";

export default function OnboardingPage() {
    const { firebaseUser, user, refreshProfile, loading } = useAuth();
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [roleSelected, setRoleSelected] = useState<"client" | "expert" | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form fields
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        if (!loading && firebaseUser) {
            setName(firebaseUser.displayName || "");
        }
    }, [firebaseUser, loading]);

    useEffect(() => {
        if (!loading && user?.role) {
            router.replace("/dashboard");
        }
    }, [user, loading, router]);

    const handleSaveClient = async () => {
        if (!firebaseUser) return;
        setIsSaving(true);
        try {
            await setDoc(doc(db, "users", firebaseUser.uid), {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: name,
                firstName: name.trim().split(" ")[0] || "",
                lastName: name.trim().split(" ").slice(1).join(" "),
                phone: phone,
                cc: user?.cc ?? "",
                birthYear: user?.birthYear ?? 0,
                role: "client",
                avatarUrl: user?.avatarUrl || firebaseUser.photoURL || "",
                h3Res9: "",
                country: "CO",
                fcmToken: user?.fcmToken || "",
                preferredCategories: user?.preferredCategories || [],
                expertPopupDismissals: user?.expertPopupDismissals ?? 0,
                isExpertEnabled: user?.isExpertEnabled ?? true,
                createdAt: user?.createdAt ?? serverTimestamp(),
                lastActiveAt: serverTimestamp(),
            }, { merge: true });
            await refreshProfile();
            router.push("/dashboard");
        } catch (error) {
            console.error(error);
            setIsSaving(false);
        }
    };

    if (loading || !firebaseUser || user?.role) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <Loader2 className="w-8 h-8 text-[#34af00] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#f8fafc] px-6 py-12 md:py-20 max-w-md mx-auto relative">
            <div className="flex justify-center mb-10">
                <Logo />
            </div>

            {step === 1 && (
                <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h1 className="text-2xl font-extrabold text-slate-900 text-center mb-2">¿Qué buscas hoy?</h1>
                    <p className="text-slate-500 text-center mb-8 text-sm">Elige cómo quieres usar Chambit.</p>

                    <div className="space-y-4">
                        <button
                            onClick={() => setRoleSelected("client")}
                            className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${roleSelected === 'client' ? 'border-[#34af00] bg-green-50' : 'border-slate-200 bg-white hover:border-[#34af00]/50'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${roleSelected === 'client' ? 'bg-[#34af00] text-white' : 'bg-slate-100 text-slate-500'}`}>
                                    <UserIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">Contratar servicios</h3>
                                    <p className="text-sm text-slate-500 mt-0.5">Necesito un experto para un trabajo.</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => setRoleSelected("expert")}
                            className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${roleSelected === 'expert' ? 'border-[#34af00] bg-green-50' : 'border-slate-200 bg-white hover:border-[#34af00]/50'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${roleSelected === 'expert' ? 'bg-[#34af00] text-white' : 'bg-slate-100 text-slate-500'}`}>
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">Ofrecer mis servicios</h3>
                                    <p className="text-sm text-slate-500 mt-0.5">Quiero trabajar y conseguir clientes.</p>
                                </div>
                            </div>
                        </button>
                    </div>

                    <button
                        disabled={!roleSelected}
                        onClick={() => setStep(2)}
                        className="w-full mt-10 h-14 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: "linear-gradient(135deg, #34af00, #2d9600)", boxShadow: roleSelected ? "0 4px 20px rgba(52,175,0,.3)" : "none" }}
                    >
                        Continuar <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            {step === 2 && roleSelected === "client" && (
                <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
                    <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Tus datos personales</h1>
                    <p className="text-slate-500 mb-8 text-sm">Para que los expertos puedan contactarte.</p>

                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700">Nombre completo</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-14 bg-white border border-slate-200 rounded-2xl px-4 outline-none focus:border-[#34af00] focus:ring-1 focus:ring-[#34af00] transition-all"
                                placeholder="Ej. Juan Pérez"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700">Teléfono celular</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full h-14 bg-white border border-slate-200 rounded-2xl px-4 outline-none focus:border-[#34af00] focus:ring-1 focus:ring-[#34af00] transition-all"
                                placeholder="Ej. 300 123 4567"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-10">
                        <button
                            onClick={() => setStep(1)}
                            className="h-14 px-6 rounded-2xl font-bold bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
                        >
                            Atrás
                        </button>
                        <button
                            disabled={!name || !phone || isSaving}
                            onClick={handleSaveClient}
                            className="flex-1 h-14 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            style={{ background: "linear-gradient(135deg, #34af00, #2d9600)" }}
                        >
                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Empezar a buscar"}
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && roleSelected === "expert" && (
                <div className="flex-1 text-center py-10 animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                        <Briefcase className="w-10 h-10 text-[#34af00]" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900 mb-3">¡Bienvenido colega!</h1>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                        Para ofrecer tus servicios, te redigiremos al formulario de registro de profesional completo.
                    </p>
                    <button
                        onClick={() => router.push("/onboarding/expert")}
                        className="w-full h-14 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all"
                        style={{ background: "linear-gradient(135deg, #34af00, #2d9600)" }}
                    >
                        Configurar mi perfil de Experto <ArrowRight className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setStep(1)}
                        className="mt-4 text-sm font-semibold text-slate-400 hover:text-slate-600"
                    >
                        Volver
                    </button>
                </div>
            )}
        </div>
    );
}
