"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, MessageCircle, Phone, CheckCircle, Loader2, Send } from "lucide-react";

export default function ContactoPage() {
    const [form, setForm] = useState({ nombre: "", correo: "", asunto: "", mensaje: "" });
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        // Simulate async send — replace with real endpoint when ready
        await new Promise(r => setTimeout(r, 1500));
        setStatus("sent");
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero */}
            <div
                className="relative px-6 pt-14 pb-16 text-white overflow-hidden"
                style={{ background: "linear-gradient(135deg, #1e6e00 0%, #34af00 60%, #4acf10 100%)" }}
            >
                {/* Decorative circles */}
                <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10" />
                <div className="absolute -left-8 bottom-0 w-32 h-32 rounded-full bg-white/5" />

                <div className="max-w-3xl mx-auto relative">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Volver al inicio
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Contáctanos</h1>
                    <p className="text-white/80 text-base md:text-lg max-w-lg">
                        Estamos aquí para ayudarte. Cuéntanos cómo podemos mejorar tu experiencia en Chambit.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-[1fr_2fr] gap-10">
                {/* Contact cards */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800 mb-6">Canales de contacto</h2>

                    {[
                        {
                            icon: Mail,
                            title: "Correo electrónico",
                            desc: "soporte@chambit.co",
                            sub: "Respuesta en 24–48 horas",
                            color: "#34af00",
                        },
                        {
                            icon: MessageCircle,
                            title: "Chat de soporte",
                            desc: "Disponible en la app",
                            sub: "Lun–Vie · 8am–6pm",
                            color: "#0ea5e9",
                        },
                        {
                            icon: Phone,
                            title: "Línea de atención",
                            desc: "601 123 4567",
                            sub: "Solo urgencias",
                            color: "#8b5cf6",
                        },
                    ].map(({ icon: Icon, title, desc, sub, color }) => (
                        <div key={title} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                style={{ backgroundColor: `${color}15` }}
                            >
                                <Icon className="w-5 h-5" style={{ color }} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-800">{title}</p>
                                <p className="text-sm text-slate-600 font-medium">{desc}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Form */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                    {status === "sent" ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                <CheckCircle className="w-8 h-8 text-[#34af00]" />
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-900 mb-2">¡Mensaje enviado!</h3>
                            <p className="text-slate-500 text-sm max-w-xs">
                                Gracias por escribirnos. Te responderemos lo antes posible a <strong>{form.correo}</strong>.
                            </p>
                            <button
                                onClick={() => { setForm({ nombre: "", correo: "", asunto: "", mensaje: "" }); setStatus("idle"); }}
                                className="mt-8 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                                style={{ background: "linear-gradient(135deg, #34af00, #2d9600)" }}
                            >
                                Enviar otro mensaje
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid sm:grid-cols-2 gap-5">
                                <label className="space-y-1.5">
                                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Nombre</span>
                                    <input
                                        required
                                        value={form.nombre}
                                        onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                                        className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#34af00]/30 focus:border-[#34af00] transition"
                                        placeholder="Tu nombre completo"
                                    />
                                </label>
                                <label className="space-y-1.5">
                                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Correo</span>
                                    <input
                                        required
                                        type="email"
                                        value={form.correo}
                                        onChange={e => setForm(f => ({ ...f, correo: e.target.value }))}
                                        className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#34af00]/30 focus:border-[#34af00] transition"
                                        placeholder="tucorreo@ejemplo.com"
                                    />
                                </label>
                            </div>

                            <label className="space-y-1.5 block">
                                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Asunto</span>
                                <select
                                    required
                                    value={form.asunto}
                                    onChange={e => setForm(f => ({ ...f, asunto: e.target.value }))}
                                    className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#34af00]/30 focus:border-[#34af00] transition appearance-none"
                                >
                                    <option value="">Selecciona un asunto</option>
                                    <option>Problema con una solicitud</option>
                                    <option>Reporte de experto</option>
                                    <option>Problema con mi cuenta</option>
                                    <option>Sugerencia de mejora</option>
                                    <option>Prensa / Alianzas</option>
                                    <option>Otro</option>
                                </select>
                            </label>

                            <label className="space-y-1.5 block">
                                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Mensaje</span>
                                <textarea
                                    required
                                    value={form.mensaje}
                                    onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))}
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#34af00]/30 focus:border-[#34af00] transition resize-none"
                                    placeholder="Cuéntanos con detalle cómo podemos ayudarte..."
                                />
                            </label>

                            <button
                                type="submit"
                                disabled={status === "sending"}
                                className="w-full h-12 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                style={{ background: "linear-gradient(135deg, #34af00, #2d9600)", boxShadow: "0 4px 20px rgba(52,175,0,.25)" }}
                            >
                                {status === "sending" ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                                ) : (
                                    <><Send className="w-4 h-4" /> Enviar mensaje</>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}