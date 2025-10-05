"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const mainTabs = [
    { href: "/terminus/proyecto", label: "Proyecto Chambit" },
    { href: "/terminus/investigacion", label: "Investigación" },
    { href: "/terminus/ciencia", label: "Ciencia" },
    { href: "/terminus/noticias", label: "Noticias" },
];

const proyectoSubs = [
    { href: "/terminus/proyecto/sobre-nosotros", label: "Sobre nosotros" },
    { href: "/terminus/proyecto/desarrolladores", label: "Desarrolladores" },
    { href: "/terminus/proyecto/directores", label: "Directores" },
    { href: "/terminus/proyecto/patrocinadores", label: "Patrocinadores" },
    { href: "/terminus/proyecto/contactanos", label: "Contactanos" },
];

const investigacionSubs = [
    { href: "/terminus/investigacion/planteamiento", label: "Planteamiento" },
    { href: "/terminus/investigacion/justificacion", label: "Justificación" },
    { href: "/terminus/investigacion/teoria", label: "Teoría" },
    { href: "/terminus/investigacion/metodologia", label: "Metodología" },
    { href: "/terminus/investigacion/cronograma", label: "Cronograma" },
];

export default function TerminusLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    let subTabs = null;
    if (pathname.startsWith("/terminus/proyecto/")) {
        subTabs = proyectoSubs;
    } else if (pathname.startsWith("/terminus/investigacion/")) {
        subTabs = investigacionSubs;
    }

    const tabs = subTabs || mainTabs;

    return (
        <div className="min-h-screen">
            {/* Sub-header Terminus */}
            <div className="fixed top-[var(--header-height)] left-0 right-0 z-40 bg-white">
                <div className="px-16 py-3">
                    <nav className="flex gap-6 overflow-x-auto">
                        {tabs.map((t) => {
                            const active = pathname === t.href;
                            return (
                                <Link
                                    key={t.href}
                                    href={t.href}
                                    className={cn(
                                        "whitespace-nowrap text-sm transition-colors",
                                        active
                                            ? "text-[#319e2d] "
                                            : "text-[#ed1515 ]/80 hover:text-[#1f1f1f ]"
                                    )}
                                >
                                    {t.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Contenido */}
            <main className="mx-auto max-w-6xl px-4 py-8">
                {children}
            </main>
        </div>
    );
}