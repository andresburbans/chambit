export const metadata = {
    title: "Derechos reservados — Chambit",
};

export default function DerechosReservadosPage() {
    const year = new Date().getFullYear();
    return (
        <article className="prose max-w-3xl">
            <h1>Derechos reservados</h1>
            <p>
                © {year} Chambit. Todos los derechos reservados. El contenido, diseño,
                logotipos, marcas y materiales de esta plataforma están protegidos por
                las normas de propiedad intelectual vigentes.
            </p>
            <h2>Uso permitido</h2>
            <p>
                El uso de esta plataforma está sujeto a los{" "}
                <a href="/terminos">Términos y condiciones</a> y a la{" "}
                <a href="/privacidad">Política de privacidad</a>. Queda prohibida la
                reproducción no autorizada de cualquier material aquí publicado.
            </p>
        </article>
    );
}