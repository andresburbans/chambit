// Datos mock para Ciencia y Noticias
export type Post = {
    id: string;
    title: string;
    summary: string;
    href: string;
    dateISO: string;      // para ordenar por fecha
    relevance?: number;   // 0..100 (opcional)
};

const now = Date.now();

export const cienciaPosts: Post[] = [
    {
        id: "c1",
        title: "Modelo de matching geo-contextual v0.2",
        summary: "Prototipo de heurística de pertinencia con geohash y señales de reputación.",
        href: "/terminus/ciencia",
        dateISO: new Date(now - 1000 * 60 * 60 * 12).toISOString(),
        relevance: 88,
    },
    {
        id: "c2",
        title: "Validación de precios mínimos por subcategoría",
        summary: "Umbrales por categoría y curva de elasticidad observada en pruebas.",
        href: "/terminus/ciencia",
        dateISO: new Date(now - 1000 * 60 * 60 * 36).toISOString(),
        relevance: 75,
    },
    {
        id: "c3",
        title: "Diseño de XP y rangos (D–S)",
        summary: "Progresión subexponencial y tasas de abandono vs. motivadores.",
        href: "/terminus/ciencia",
        dateISO: new Date(now - 1000 * 60 * 60 * 70).toISOString(),
        relevance: 92,
    },
    {
        id: "c4",
        title: "Ensayo A/B: CTA 'Cotizar' sticky",
        summary: "Incremento del 14% en inicios de oferta con sticky CTA.",
        href: "/terminus/ciencia",
        dateISO: new Date(now - 1000 * 60 * 60 * 96).toISOString(),
        relevance: 63,
    },
    {
        id: "c5",
        title: "Tiempos de llegada por radio y tráfico",
        summary: "Estimadores por franja horaria y aprendizaje básico.",
        href: "/terminus/ciencia",
        dateISO: new Date(now - 1000 * 60 * 60 * 120).toISOString(),
        relevance: 59,
    },
    {
        id: "c6",
        title: "Prototipo de notificaciones PWA",
        summary: "Entregabilidad y latencia inicial en navegadores móviles.",
        href: "/terminus/ciencia",
        dateISO: new Date(now - 1000 * 60 * 60 * 140).toISOString(),
        relevance: 40,
    },
];

export const noticiasPosts: Post[] = [
    {
        id: "n1",
        title: "Chambit cierra MVP de PWA",
        summary: "Búsqueda, detalle de servicios y flujo de cotización listos para pruebas.",
        href: "/terminus/noticias",
        dateISO: new Date(now - 1000 * 60 * 60 * 5).toISOString(),
        relevance: 95,
    },
    {
        id: "n2",
        title: "Alianza con gremio local de plomería",
        summary: "Piloto de adopción con 25 expertos verificados.",
        href: "/terminus/noticias",
        dateISO: new Date(now - 1000 * 60 * 60 * 26).toISOString(),
        relevance: 80,
    },
    {
        id: "n3",
        title: "Nuevo bucket de Storage para portfolios",
        summary: "Soporte para fotos 'antes/después' en reseñas.",
        href: "/terminus/noticias",
        dateISO: new Date(now - 1000 * 60 * 60 * 48).toISOString(),
        relevance: 60,
    },
    {
        id: "n4",
        title: "Mejoras en accesibilidad",
        summary: "Contraste y foco de teclado en toda la PWA.",
        href: "/terminus/noticias",
        dateISO: new Date(now - 1000 * 60 * 60 * 80).toISOString(),
        relevance: 55,
    },
    {
        id: "n5",
        title: "Roadmap público v0.1",
        summary: "Visibilidad del backlog y votación de features.",
        href: "/terminus/noticias",
        dateISO: new Date(now - 1000 * 60 * 60 * 110).toISOString(),
        relevance: 50,
    },
    {
        id: "n6",
        title: "Lanzamiento de clanes (beta cerrada)",
        summary: "Gremios internos con ranking y XP compartido.",
        href: "/terminus/noticias",
        dateISO: new Date(now - 1000 * 60 * 60 * 130).toISOString(),
        relevance: 45,
    },
];