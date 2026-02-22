"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Loader2, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/layout/logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getErrorMsg = (code: string) => {
    const map: Record<string, string> = {
      "auth/user-not-found": "No existe una cuenta con ese correo.",
      "auth/wrong-password": "Contraseña incorrecta.",
      "auth/invalid-credential": "Credenciales inválidas.",
      "auth/too-many-requests": "Demasiados intentos. Espera unos minutos.",
      "auth/invalid-email": "El correo no tiene un formato válido.",
      "auth/popup-closed-by-user": "Cerraste la ventana de Google antes de completar.",
    };
    return map[code] ?? "Error inesperado. Inténtalo de nuevo.";
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(getErrorMsg(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const uid = result.user.uid;

      const snap = await getDoc(doc(db, "users", uid));
      if (!snap.exists()) {
        await setDoc(doc(db, "users", uid), {
          uid,
          email: result.user.email ?? "",
          displayName: result.user.displayName ?? "Usuario",
          avatarUrl: result.user.photoURL ?? "",
          phone: "",
          role: "client",
          h3Res9: "",
          country: "CO",
          preferredCategories: [],
          expertPopupDismissals: 0,
          isExpertEnabled: false,
          createdAt: new Date(),
          lastActiveAt: new Date(),
        }, { merge: true });
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(getErrorMsg(err.code));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] px-6 py-10">
      {/* Back button */}
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-8 self-start"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Inicio</span>
      </button>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="mb-8">
          <Logo />
        </div>

        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-extrabold text-slate-900 text-center mb-1">
            Bienvenido de nuevo
          </h1>
          <p className="text-sm text-slate-500 text-center mb-8">
            Inicia sesión para continuar en Chambit
          </p>

          {/* Google Button */}
          <button
            id="btn-google-login"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 rounded-2xl border-2 border-slate-200 bg-white text-slate-800 font-semibold text-sm transition-all hover:border-slate-300 hover:shadow-sm active:scale-[0.98] disabled:opacity-60 mb-4"
            style={{ height: "52px" }}
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            {googleLoading ? "Conectando..." : "Continuar con Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">o con correo</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmail} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="input-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="tucorreo@ejemplo.com"
                className="w-full pl-11 pr-4 rounded-2xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#34af00] focus:ring-1 focus:ring-[#34af00] transition-all"
                style={{ height: "52px" }}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="input-password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Contraseña"
                className="w-full pl-11 pr-12 rounded-2xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#34af00] focus:ring-1 focus:ring-[#34af00] transition-all"
                style={{ height: "52px" }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                tabIndex={-1}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-2xl bg-red-50 border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="text-xs text-red-600 leading-tight">{error}</span>
              </div>
            )}

            <button
              id="btn-email-login"
              type="submit"
              disabled={loading || googleLoading}
              className="w-full font-bold text-white flex items-center justify-center gap-2 rounded-2xl transition-all active:scale-95 disabled:opacity-60"
              style={{
                height: "52px",
                background: "linear-gradient(135deg, #34af00, #2d9600)",
                boxShadow: "0 4px 20px rgba(52,175,0,.3)",
              }}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {loading ? "Entrando..." : "Iniciar sesión"}
            </button>
          </form>

          {/* Footer links */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-xs text-slate-500">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="font-bold text-[#34af00] hover:underline">
                Regístrate gratis
              </Link>
            </p>
            <p className="text-xs text-slate-400">
              ¿Olvidaste tu contraseña?{" "}
              <Link href="/contacto" className="underline hover:text-slate-600">
                Escríbenos
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
