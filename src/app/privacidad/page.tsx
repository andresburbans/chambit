export const metadata = {
    title: "Política de privacidad — Chambit",
};

export default function PrivacidadPage() {
    return (
        <article className="prose max-w-3xl">
            <h1>Política de privacidad</h1>
            <p>
                En Chambit nos tomamos en serio tu privacidad. Esta política explica
                qué datos recolectamos, cómo los usamos y tus derechos.
            </p>
            <h2>Datos que recolectamos</h2>
            <ul>
                <li>Datos de cuenta: nombre, email, teléfono.</li>
                <li>Datos de uso: búsquedas, clics, navegación.</li>
                <li>Datos de ubicación (si lo autorizas): para mejorar la pertinencia.</li>
            </ul>
            <h2>Cómo usamos tus datos</h2>
            <ul>
                <li>Para operar la plataforma y proveer servicios.</li>
                <li>Para recomendaciones y seguridad.</li>
                <li>Para comunicaciones transaccionales y soporte.</li>
            </ul>
            <h2>Tus derechos</h2>
            <p>
                Puedes solicitar acceso, rectificación o eliminación de tus datos.
                Escríbenos a <a href="/terminus/proyecto/contactanos">Contáctanos</a>.
            </p>
            <p>Última actualización: {new Date().toLocaleDateString()}</p>
        </article>
    );
}