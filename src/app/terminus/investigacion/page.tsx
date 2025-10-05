import Link from "next/link";
import { Card } from "@/components/ui/card";

const subsections = [
    { label: "Planteamiento", href: "/terminus/investigacion/planteamiento" },
    { label: "Justificación", href: "/terminus/investigacion/justificacion" },
    { label: "Teoría", href: "/terminus/investigacion/teoria" },
    { label: "Metodología", href: "/terminus/investigacion/metodologia" },
    { label: "Cronograma", href: "/terminus/investigacion/cronograma" },
];

export default function Investigacion() {
    return (
        <section className="space-y-6">
            <h1 className="text-3xl font-bold">Investigación</h1>
            <p className="text-muted-foreground max-w-3xl">
                Marco conceptual, procesos y cronograma del proyecto.
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