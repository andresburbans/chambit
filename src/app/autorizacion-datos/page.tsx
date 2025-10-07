export const metadata = {
    title: "Autorización para procesamiento de datos — Chambit",
};

export default function AutorizacionDatosPage() {
    return (
        <article className="prose max-w-3xl">
            <h1>Autorización para procesamiento de datos</h1>
            <p>
                Al registrarte y usar Chambit, autorizas el tratamiento de tus datos
                personales conforme a nuestra <a href="/privacidad">Política de privacidad</a>.
            </p>
            <h2>Finalidades</h2>
            <ul>
                <li>Gestionar tu cuenta y la relación cliente–experto.</li>
                <li>Mejorar el servicio y realizar métricas de uso.</li>
                <li>Prevención de fraude y seguridad.</li>
            </ul>
            <h2>Revocatoria</h2>
            <p>
                Puedes revocar tu autorización en cualquier momento. Esto puede limitar
                funcionalidades de la plataforma. Para ejercer tus derechos, visita{" "}
                <a href="/terminus/proyecto/contactanos">Contáctanos</a>.
            </p>
        </article>
    );
}