export const metadata = {
    title: "Términos y condiciones — Chambit",
};

export default function TerminosPage() {
    return (
        <article className="prose max-w-3xl">
            <h1>Términos y condiciones</h1>
            <p>
                Bienvenido a Chambit. Al usar esta plataforma aceptas estos Términos y
                condiciones. Lee también nuestra <a href="/privacidad">Política de privacidad</a>.
            </p>
            <h2>Cuenta y elegibilidad</h2>
            <ul>
                <li>Debes ser mayor de edad para crear una cuenta.</li>
                <li>La información provista debe ser verídica y actualizada.</li>
            </ul>
            <h2>Uso de la plataforma</h2>
            <ul>
                <li>No está permitido el uso fraudulento o con fines ilícitos.</li>
                <li>Chambit puede suspender cuentas ante incumplimientos o abusos.</li>
            </ul>
            <h2>Relación cliente–experto</h2>
            <p>
                Chambit facilita el contacto entre clientes y expertos, pero no se
                constituye como parte del contrato de prestación de servicios entre
                ellos, salvo que se indique lo contrario en servicios específicos.
            </p>
            <h2>Responsabilidad</h2>
            <p>
                En la medida permitida por ley, Chambit no se hace responsable por daños
                indirectos, incidentales o emergentes derivados del uso de la
                plataforma.
            </p>
            <h2>Modificaciones</h2>
            <p>
                Podemos actualizar estos términos cuando sea necesario. La continuidad
                del uso implica la aceptación de los cambios.
            </p>
            <p>Última actualización: {new Date().toLocaleDateString()}</p>
        </article>
    );
}