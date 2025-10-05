import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const items = [
    { title: "Proyecto Chambit", desc: "Contexto, equipo y patrocinadores.", href: "/terminus/proyecto" },
    { title: "Investigación", desc: "Planteamiento, teoría y metodología.", href: "/terminus/investigacion" },
    { title: "Ciencia", desc: "Últimos hallazgos técnicos y experimentos.", href: "/terminus/ciencia" },
    { title: "Noticias", desc: "Actualizaciones y comunicados.", href: "/terminus/noticias" },
];

export default function TerminusHome() {
    return (
        <div className="grid sm:grid-cols-2 gap-6">
            {items.map((it) => (
                <Link key={it.href} href={it.href}>
                    <Card className="hover:shadow-md transition-shadow h-full">
                        <CardHeader>
                            <CardTitle>{it.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{it.desc}</p>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
}