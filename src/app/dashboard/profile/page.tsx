"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { UserService } from "@/lib/services/user.service";
import { uploadImage } from "@/lib/services/image.service";
import {
    Camera, Save, Loader2, MapPin, User, Phone, BookOpen,
    Star, Briefcase, CheckCircle, ChevronRight, LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

// ─── Avatar Upload Area ────────────────────────────────────────────────────────

function AvatarUpload({
    currentUrl,
    initials,
    uploading,
    onFileSelect,
}: {
    currentUrl?: string;
    initials: string;
    uploading: boolean;
    onFileSelect: (f: File) => void;
}) {
    const fileRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex flex-col items-center gap-3 py-6">
            <div className="relative">
                {/* Avatar circle */}
                <div
                    className="w-24 h-24 rounded-3xl overflow-hidden flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #34af00, #2d9600)" }}
                >
                    {currentUrl ? (
                        <img src={currentUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-white text-2xl font-bold">{initials}</span>
                    )}
                    {uploading && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-3xl">
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                        </div>
                    )}
                </div>

                {/* Camera button */}
                <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#34af00] flex items-center justify-center shadow-lg border-2 border-white transition-all active:scale-90"
                >
                    <Camera className="w-4 h-4 text-white" />
                </button>
            </div>

            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) onFileSelect(e.target.files[0]); }}
            />

            <p className="text-xs text-slate-400">Toca la cámara para cambiar tu foto</p>
        </div>
    );
}

// ─── Profile Field ─────────────────────────────────────────────────────────────

function ProfileField({
    label,
    value,
    onChange,
    placeholder,
    multiline,
    icon: Icon,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    multiline?: boolean;
    icon?: React.ElementType;
}) {
    return (
        <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                {Icon && <Icon className="w-3.5 h-3.5" />} {label}
            </label>
            {multiline ? (
                <textarea
                    rows={3}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#34af00] focus:bg-white transition-colors resize-none"
                />
            ) : (
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#34af00] focus:bg-white transition-colors"
                />
            )}
        </div>
    );
}

// ─── Stat mini card ───────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
    return (
        <div className="flex-1 flex flex-col items-center gap-1 p-3 rounded-2xl bg-slate-50">
            <Icon className="w-4 h-4 text-[#34af00]" />
            <span className="text-base font-bold text-slate-900">{value}</span>
            <span className="text-[10px] text-slate-500 text-center leading-tight">{label}</span>
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
    const { user, refreshProfile } = useAuth();
    const router = useRouter();

    const [name, setName] = useState(user?.displayName ?? "");
    const [phone, setPhone] = useState(user?.phone ?? "");
    const [bio, setBio] = useState(user?.expert?.bio ?? "");

    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);

    const initials = name.substring(0, 2).toUpperCase() || "U";

    const showToast = (ok: boolean, msg: string) => {
        setToast({ ok, msg });
        setTimeout(() => setToast(null), 3000);
    };

    // ── Avatar upload ──
    const handleAvatarUpload = async (file: File) => {
        if (!user) return;
        setUploading(true);
        try {
            const result = await uploadImage(file, "avatar", user.uid);
            await UserService.updateProfile(user.uid, { avatarUrl: result.url });
            await refreshProfile();
            showToast(true, "Foto actualizada ✓");
        } catch {
            showToast(false, "Error al subir la foto");
        } finally {
            setUploading(false);
        }
    };

    // ── Save profile ──
    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            await UserService.updateProfile(user.uid, {
                displayName: name,
                phone,
                ...(bio ? { "expert.bio": bio } : {}),
            });
            await refreshProfile();
            showToast(true, "Perfil guardado ✓");
        } catch {
            showToast(false, "Error al guardar");
        } finally {
            setSaving(false);
        }
    };

    // ── Sign out ──
    const handleSignOut = async () => {
        await signOut(auth);
        router.push("/");
    };

    return (
        <div className="flex flex-col pb-8">
            {/* Avatar */}
            <AvatarUpload
                currentUrl={user?.avatarUrl}
                initials={initials}
                uploading={uploading}
                onFileSelect={handleAvatarUpload}
            />

            {/* Name + role badge */}
            <div className="text-center px-4 -mt-2 mb-5">
                <p className="text-xl font-bold text-slate-900">{user?.displayName ?? "Usuario"}</p>
                <span className={cn(
                    "inline-flex items-center gap-1 mt-1 px-3 py-0.5 rounded-full text-xs font-semibold",
                    user?.role === "expert"
                        ? "bg-green-50 text-[#34af00] border border-[#34af00]/30"
                        : "bg-slate-100 text-slate-600"
                )}>
                    {user?.role === "expert" ? <CheckCircle className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {user?.role === "expert" ? "Experto" : "Cliente"}
                </span>
            </div>

            {/* Stats row (experts only) */}
            {user?.role === "expert" && (
                <div className="flex gap-2.5 px-4 mb-6">
                    <StatCard label="Calificación" value={`${user.expert?.rating?.toFixed(1) ?? "—"}`} icon={Star} />
                    <StatCard label="Reseñas" value={`${user.expert?.ratingCount ?? 0}`} icon={Star} />
                    <StatCard label="Trabajos" value="12" icon={Briefcase} />
                </div>
            )}

            {/* Form fields */}
            <div className="px-4 space-y-4">
                <ProfileField label="Nombre completo" value={name} onChange={setName} placeholder="Ej. Juan Pérez" icon={User} />

                <ProfileField label="Teléfono" value={phone} onChange={setPhone} placeholder="+57 300 000 0000" icon={Phone} />

                {user?.role === "expert" && (
                    <ProfileField label="Sobre ti" value={bio} onChange={setBio} placeholder="Describe tus habilidades y experiencia..." multiline icon={BookOpen} />
                )}

                {/* Location row (read-only, static for now) */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <MapPin className="w-4 h-4 text-[#34af00] shrink-0" />
                    <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ubicación</p>
                        <p className="text-sm text-slate-800 mt-0.5">Cali, Colombia</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
            </div>

            {/* Save button */}
            <div className="px-4 mt-6">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full h-13 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60"
                    style={{
                        background: "linear-gradient(135deg, #34af00, #2d9600)",
                        boxShadow: "0 4px 20px rgba(52,175,0,0.30)",
                        height: "52px",
                    }}
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {saving ? "Guardando..." : "Guardar cambios"}
                </button>
            </div>

            {/* Sign out */}
            <div className="px-4 mt-4">
                <button
                    onClick={handleSignOut}
                    className="w-full h-12 rounded-2xl font-semibold text-slate-600 text-sm flex items-center justify-center gap-2 bg-slate-100 transition-all active:scale-95 hover:bg-slate-200"
                >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                </button>
            </div>

            {/* Toast */}
            {toast && (
                <div className={cn(
                    "fixed bottom-24 left-4 right-4 z-50 px-4 py-3 rounded-2xl text-white text-sm font-semibold shadow-xl flex items-center gap-2",
                    "transition-all",
                    toast.ok ? "bg-[#34af00]" : "bg-red-500"
                )}>
                    {toast.ok ? <CheckCircle className="w-4 h-4" /> : null}
                    {toast.msg}
                </div>
            )}
        </div>
    );
}
