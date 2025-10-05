import Link from "next/link";
import { Card } from "@/components/ui/card";

const subsections = [
    { label: "Sobre nosotros", href: "/terminus/proyecto/sobre-nosotros" },
    { label: "Desarrolladores", href: "/terminus/proyecto/desarrolladores" },
    { label: "Directores", href: "/terminus/proyecto/directores" },
    { label: "Patrocinadores", href: "/terminus/proyecto/patrocinadores" },
    { label: "Contáctanos", href: "/terminus/proyecto/contactanos" },
];

export default function Proyecto() {
    return (
        <section className="space-y-6">
            <h1 className="text-3xl font-bold">Proyecto Chambit</h1>
            <p className="text-muted-foreground max-w-3xl">
                Información institucional del proyecto, equipo y vías de contacto.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subsections.map((s) => (
                    <Link key={s.href} href={s.href} className="group">
                        <Card className="p-5 hover:shadow transition">
                            <div className="font-medium group-hover:text-[#4CAF50]">{s.label}</div>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
}