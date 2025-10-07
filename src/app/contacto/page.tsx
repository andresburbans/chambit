export const metadata = {
    title: "Contáctanos — Chambit",
};

export default function ContactoPage() {
    return (
        <section className="max-w-3xl">
            <h1 className="text-3xl font-bold mb-2">Contáctanos</h1>
            <p className="text-muted-foreground mb-6">
                Cuéntanos cómo podemos ayudarte. Te responderemos lo antes posible.
            </p>

            <form className="grid gap-4">
                <label className="grid gap-1">
                    <span className="text-sm">Nombre</span>
                    <input className="border rounded-md px-3 py-2" placeholder="Tu nombre" />
                </label>
                <label className="grid gap-1">
                    <span className="text-sm">Correo</span>
                    <input type="email" className="border rounded-md px-3 py-2" placeholder="tucorreo@ejemplo.com" />
                </label>
                <label className="grid gap-1">
                    <span className="text-sm">Asunto</span>
                    <input className="border rounded-md px-3 py-2" placeholder="¿Sobre qué nos escribes?" />
                </label>
                <label className="grid gap-1">
                    <span className="text-sm">Mensaje</span>
                    <textarea className="border rounded-md px-3 py-2 min-h-[120px]" placeholder="Tu mensaje..." />
                </label>
                <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md bg-[#4CAF50] px-4 py-2 text-white text-sm font-medium hover:bg-[#43a047] transition"
                >
                    Enviar
                </button>
            </form>
        </section>
    );
}