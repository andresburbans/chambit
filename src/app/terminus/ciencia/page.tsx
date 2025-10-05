import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cienciaPosts } from "@/lib/terminus-data";

function top5() {
    return [...cienciaPosts]
        .sort((a, b) => {
            // primero por fecha (desc), luego por relevancia
            const d = +new Date(b.dateISO) - +new Date(a.dateISO);
            if (d !== 0) return d;
            return (b.relevance ?? 0) - (a.relevance ?? 0);
        })
        .slice(0, 5);
}

export default function Ciencia() {
    const posts = top5();

    return (
        <section className="space-y-6">
            <h1 className="text-3xl font-bold">Ciencia</h1>
            <p className="text-muted-foreground max-w-3xl">
                Últimas actualizaciones técnicas y hallazgos del proyecto.
            </p>

            <div className="space-y-4">
                {posts.map((p) => (
                    <Link key={p.id} href={p.href}>
                        <Card className="p-5 hover:shadow-md transition">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="font-medium text-lg">{p.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">{p.summary}</p>
                                </div>
                                <time className="text-xs text-muted-foreground shrink-0">
                                    {new Date(p.dateISO).toLocaleDateString()}
                                </time>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
}