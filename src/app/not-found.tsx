import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Página no encontrada | Chambit',
};

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <div className="w-24 h-24 mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                <Search className="w-12 h-12 text-[#34af00]" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">404</h1>
            <h2 className="text-xl font-bold text-slate-800 mb-2">No pudimos encontrar esta página</h2>
            <p className="text-slate-500 max-w-sm mx-auto mb-8">
                Es posible que el enlace esté roto o que la página haya sido eliminada.
            </p>

            <Link href="/">
                <Button className="bg-[#34af00] hover:bg-[#2d9600] text-white h-12 px-8 rounded-full font-bold">
                    <Home className="w-4 h-4 mr-2" />
                    Volver al inicio
                </Button>
            </Link>
        </div>
    );
}
