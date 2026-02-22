'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const MapComponent = dynamic(
    () => import('./MapComponent'),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#34af00]" />
                <p className="text-sm font-medium">Cargando mapa interactivo...</p>
            </div>
        )
    }
);

interface SearchMapProps {
    results: any[]; // Using any to avoid circular dependency, or we can extract ExpertResult
    selectedId?: string;
    onSelect?: (expert: any) => void;
}

export function SearchMap({ results, selectedId, onSelect }: SearchMapProps) {
    return (
        <div className="w-full h-full relative z-0">
            <MapComponent
                results={results}
                selectedId={selectedId}
                onSelect={onSelect}
            />
        </div>
    );
}
