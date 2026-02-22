'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Runtime Error:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <div className="w-24 h-24 mb-6 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Algo salió mal</h1>
            <h2 className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
                Tuvimos un problema procesando tu solicitud. Por favor, intenta de nuevo.
            </h2>
            {process.env.NODE_ENV === "development" && (
                <div className="mb-6 max-w-2xl rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-left text-xs text-red-700">
                    <p className="font-bold mb-1">Detalle técnico (dev):</p>
                    <p>{error?.message || "Sin mensaje"}</p>
                    {error?.digest && <p>Digest: {error.digest}</p>}
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    onClick={() => reset()}
                    className="bg-slate-900 hover:bg-slate-800 text-white h-12 px-8 rounded-full font-bold"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reintentar
                </Button>
                <Link href="/">
                    <Button variant="outline" className="h-12 px-8 rounded-full font-bold border-2">
                        <Home className="w-4 h-4 mr-2" />
                        Ir al inicio
                    </Button>
                </Link>
            </div>
        </div>
    );
}
