/**
 * Chambit Firestore Seeder — D09 Implementation
 * ================================================
 * Covers: D05 (Categories), D06 (Config), D07 (Geozones), D09 (Seed Data)
 *
 * Target database: "test1" (named Firestore database on chambit-dev1)
 * Run:  npx ts-node -P tsconfig.seed.json functions/src/scripts/seedData.ts
 *
 * Idempotent: uses set({ merge: false }) with explicit IDs so
 * running twice produces the same result (overwrites, no duplicates).
 */

import * as admin from "firebase-admin";
import { latLngToCell, gridDisk } from "h3-js";
import * as path from "path";

// ─── Firebase Admin Init ───────────────────────────────────────────────────────
const serviceAccountPath = path.resolve(
    __dirname,
    "../../../secrets/chambit-dev1-firebase-adminsdk-fbsvc-a35747d5c5.json"
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
    // Named database "test1" — Blaze plan required (active ✅)
    databaseURL: "https://chambit-dev1-default-rtdb.firebaseio.com",
});

// Point to named Firestore database "test1"
const db = admin.firestore();
db.settings({ databaseId: "test1" });

const TS = admin.firestore.FieldValue.serverTimestamp;

// ─── 1. APP CONFIG (D06) ──────────────────────────────────────────────────────
async function seedConfig(): Promise<void> {
    await db.collection("config").doc("app").set({
        minHourPrice: 9_000,
        minDayPrice: 70_000,
        maxHourPrice: 1_000_000,
        maxDayPrice: 20_000_000,
        prcDiscountFloor: 0.80,

        enableWilsonFilter: false,
        enableLTR: false,
        ltrUserThreshold: 1_000,

        h3SearchRes: 7,
        h3StorageRes: 9,
        h3KRingSize: 2,
        h3MaxKRingSize: 5,

        bayesianM: 10,
        globalAvgRating: 3.5,
        wilsonConfidence: 0.95,
        wilsonMinThreshold: 0.0,

        maxNegotiationRounds: 3,
        maxExpertServices: 5,
        maxActiveJobs: 1,
        activityHalfLifeHours: 72,

        scoringWeights: {
            distance: 0.30,
            reputation: 0.25,
            activity: 0.15,
            categoryMatch: 0.15,
            availability: 0.15,
        },
    });
    console.log("✅ [D06] config/app created");
}

// ─── 2. GEOZONES (D07) ────────────────────────────────────────────────────────
async function seedGeozones(): Promise<void> {
    // Colombia-wide geozone (primary for MVP)
    await db.collection("geozones").doc("colombia-v1").set({
        id: "colombia-v1",
        name: "Colombia",
        citySlug: "colombia",
        country: "CO",
        active: true,
        center: { lat: 4.5709, lng: -74.2973 },
        zoom: 6,
        // Res 7 cells covering Colombia's bounding box (representative sample)
        // Full coverage should be generated via the OSM H3 utility script
        boundaryH3: [
            "877533acdffffff", "87754e64cffffff", "877543b4dffffff",
            "877541b0cffffff", "877541b19ffffff", "877541b1cffffff",
            "877548804ffffff", "877548806ffffff", "87754c054ffffff",
        ],
        createdAt: TS(),
    });
    console.log("  ↳ Geozone: colombia-v1");

    // Cali urban zone (first city)
    const caliCenter = { lat: 3.4516, lng: -76.5320 };
    const caliBoundaryH3 = gridDisk(latLngToCell(caliCenter.lat, caliCenter.lng, 7), 2);

    await db.collection("geozones").doc("cali-urban-v1").set({
        id: "cali-urban-v1",
        name: "Santiago de Cali",
        citySlug: "cali",
        country: "CO",
        active: true,
        center: caliCenter,
        zoom: 13,
        boundaryH3: caliBoundaryH3,
        createdAt: TS(),
    });
    console.log("  ↳ Geozone: cali-urban-v1");
    console.log("✅ [D07] Geozones seeded");
}

// ─── 3. CATEGORIES & SUBCATEGORIES (D05) ─────────────────────────────────────
const CATALOG: Array<{
    id: string; name: string; icon: string; order: number;
    subcategories: Array<{ id: string; name: string; prc: number | null }>;
}> = [
        {
            id: "cat-reparacion", name: "Reparación y mantenimiento", icon: "wrench", order: 1,
            subcategories: [
                { id: "sub-electricidad", name: "Electricidad", prc: 35_000 },
                { id: "sub-plomeria", name: "Plomería", prc: 40_000 },
                { id: "sub-cerrajeria", name: "Cerrajería", prc: 30_000 },
                { id: "sub-refrigeracion", name: "Refrigeración y A/C", prc: 50_000 },
                { id: "sub-electrodomest", name: "Electrodomésticos", prc: 35_000 },
            ],
        },
        {
            id: "cat-cuidado", name: "Cuidado de personas y mascotas", icon: "heart", order: 2,
            subcategories: [
                { id: "sub-enfermeria", name: "Enfermería domiciliaria", prc: 45_000 },
                { id: "sub-cuidado-adulto", name: "Cuidado adulto mayor", prc: 35_000 },
                { id: "sub-cuidado-ninos", name: "Cuidado de niños", prc: 30_000 },
                { id: "sub-paseador", name: "Paseador de mascotas", prc: 20_000 },
                { id: "sub-vet-domicilio", name: "Veterinaria a domicilio", prc: 60_000 },
            ],
        },
        {
            id: "cat-construccion", name: "Construcción e ingeniería", icon: "hard-hat", order: 3,
            subcategories: [
                { id: "sub-albanileria", name: "Albañilería", prc: 45_000 },
                { id: "sub-pintura", name: "Pintura", prc: 30_000 },
                { id: "sub-pisos", name: "Pisos y enchapes", prc: 40_000 },
                { id: "sub-drywall", name: "Drywall y cielos rasos", prc: 35_000 },
                { id: "sub-impermeab", name: "Impermeabilización", prc: 50_000 },
            ],
        },
        {
            id: "cat-arquitectura", name: "Arquitectura", icon: "building", order: 4,
            subcategories: [
                { id: "sub-planos", name: "Planos y diseño", prc: 80_000 },
                { id: "sub-supervision", name: "Supervisión de obra", prc: 70_000 },
                { id: "sub-consultoria-arq", name: "Consultoría", prc: 90_000 },
            ],
        },
        {
            id: "cat-diseno", name: "Diseño gráfico e imprenta", icon: "palette", order: 5,
            subcategories: [
                { id: "sub-logo", name: "Diseño de logo", prc: 60_000 },
                { id: "sub-impresion", name: "Impresión", prc: 25_000 },
                { id: "sub-branding", name: "Branding", prc: 90_000 },
            ],
        },
        {
            id: "cat-limpieza", name: "Limpieza y mantenimiento del hogar", icon: "sparkles", order: 6,
            subcategories: [
                { id: "sub-limpieza-gral", name: "Limpieza general", prc: 25_000 },
                { id: "sub-limpieza-fondo", name: "Limpieza a fondo", prc: 35_000 },
                { id: "sub-limpieza-vidrio", name: "Limpieza de vidrios", prc: 30_000 },
                { id: "sub-control-plagas", name: "Control de plagas", prc: 80_000 },
            ],
        },
        {
            id: "cat-instalaciones", name: "Instalaciones y colocaciones", icon: "plug", order: 7,
            subcategories: [
                { id: "sub-closets", name: "Closets y muebles", prc: 40_000 },
                { id: "sub-cocinas", name: "Cocinas integrales", prc: 50_000 },
                { id: "sub-aires", name: "Instalación A/C", prc: 60_000 },
                { id: "sub-cameras", name: "Cámaras de seguridad", prc: 55_000 },
            ],
        },
        {
            id: "cat-decoracion", name: "Decoración y estética de interiores", icon: "sofa", order: 8,
            subcategories: [
                { id: "sub-decoracion-int", name: "Decoración interior", prc: 70_000 },
                { id: "sub-cortinas", name: "Cortinas y persianas", prc: 35_000 },
                { id: "sub-tapizado", name: "Tapizado de muebles", prc: 45_000 },
            ],
        },
        {
            id: "cat-belleza", name: "Belleza, estética y cuidado personal", icon: "scissors", order: 9,
            subcategories: [
                { id: "sub-peluqueria", name: "Peluquería a domicilio", prc: 30_000 },
                { id: "sub-manicure", name: "Manicure y pedicure", prc: 25_000 },
                { id: "sub-maquillaje", name: "Maquillaje", prc: 50_000 },
                { id: "sub-masajes", name: "Masajes terapéuticos", prc: 55_000 },
            ],
        },
        {
            id: "cat-soldadura", name: "Soldadura y metalurgia", icon: "flame", order: 10,
            subcategories: [
                { id: "sub-soldadura-gral", name: "Soldadura general", prc: 45_000 },
                { id: "sub-aluminio", name: "Aluminio y vidrio", prc: 50_000 },
                { id: "sub-hierro", name: "Hierro y acero", prc: 55_000 },
            ],
        },
        {
            id: "cat-mecanica", name: "Servicios de mecánica", icon: "car", order: 11,
            subcategories: [
                { id: "sub-mec-automotriz", name: "Mecánica automotriz", prc: 50_000 },
                { id: "sub-mec-motos", name: "Mecánica de motos", prc: 35_000 },
                { id: "sub-electrico-auto", name: "Eléctrico automotriz", prc: 45_000 },
            ],
        },
        {
            id: "cat-agricultura", name: "Agricultura y campo", icon: "sprout", order: 12,
            subcategories: [
                { id: "sub-jardineria", name: "Jardinería", prc: 30_000 },
                { id: "sub-poda", name: "Poda y tala", prc: 40_000 },
                { id: "sub-campo", name: "Labores de campo", prc: 30_000 },
            ],
        },
        {
            id: "cat-deporte", name: "Deporte, bienestar y salud", icon: "dumbbell", order: 13,
            subcategories: [
                { id: "sub-entrenador", name: "Entrenador personal", prc: 50_000 },
                { id: "sub-nutricion", name: "Nutricionista", prc: 80_000 },
                { id: "sub-yoga", name: "Yoga y meditación", prc: 45_000 },
            ],
        },
        {
            id: "cat-asesoria", name: "Asesoría financiera, legal y jurídica", icon: "scale", order: 14,
            subcategories: [
                { id: "sub-contable", name: "Contabilidad", prc: 80_000 },
                { id: "sub-juridico", name: "Asesoría jurídica", prc: 120_000 },
                { id: "sub-impuestos", name: "Declaración de renta", prc: 90_000 },
            ],
        },
        {
            id: "cat-veterinaria", name: "Veterinaria", icon: "paw-print", order: 15,
            subcategories: [
                { id: "sub-vet-clinica", name: "Consulta veterinaria", prc: 70_000 },
                { id: "sub-estetica-animal", name: "Estética animal", prc: 40_000 },
            ],
        },
        {
            id: "cat-enfermeria", name: "Enfermería", icon: "stethoscope", order: 16,
            subcategories: [
                { id: "sub-enf-domicilio", name: "Enfermería domiciliaria", prc: 50_000 },
                { id: "sub-toma-muestras", name: "Toma de muestras", prc: 35_000 },
                { id: "sub-curaciones", name: "Curaciones y vendajes", prc: 30_000 },
            ],
        },
        {
            id: "cat-otras", name: "Otras", icon: "more-horizontal", order: 17,
            subcategories: [
                { id: "sub-mudanzas", name: "Mudanzas y fletes", prc: 60_000 },
                { id: "sub-fotografia", name: "Fotografía", prc: 80_000 },
                { id: "sub-traduccion", name: "Traducción", prc: 50_000 },
                { id: "sub-clases", name: "Clases particulares", prc: 35_000 },
            ],
        },
    ];

async function seedCategories(): Promise<Array<{ id: string; name: string; categoryId: string; categoryName: string }>> {
    const flatCatalog: Array<{ id: string; name: string; categoryId: string; categoryName: string }> = [];
    const batch = db.batch();

    for (const cat of CATALOG) {
        const catRef = db.collection("categories").doc(cat.id);
        batch.set(catRef, {
            id: cat.id,
            name: cat.name,
            icon: cat.icon,
            order: cat.order,
        });

        for (const sub of cat.subcategories) {
            const subRef = catRef.collection("subcategories").doc(sub.id);
            batch.set(subRef, {
                id: sub.id,
                name: sub.name,
                categoryId: cat.id,
                prc: sub.prc,
                prcLastUpdated: null,
                expertCount: 0,
            });
            flatCatalog.push({ id: sub.id, name: sub.name, categoryId: cat.id, categoryName: cat.name });
        }
    }

    await batch.commit();
    console.log(`✅ [D05] ${CATALOG.length} categories + ${flatCatalog.length} subcategories seeded`);
    return flatCatalog;
}

// ─── 4. USERS — Clients & Experts (D09) ──────────────────────────────────────
// Cali neighborhoods with approximate GPS coords
const CALI_LOCATIONS = [
    { barrio: "Centro", lat: 3.4516, lng: -76.5320 },
    { barrio: "San Fernando", lat: 3.4372, lng: -76.5225 },
    { barrio: "Ciudad Jardín", lat: 3.3912, lng: -76.5434 },
    { barrio: "El Peñón", lat: 3.4451, lng: -76.5409 },
    { barrio: "Granada", lat: 3.4597, lng: -76.5349 },
    { barrio: "Aguablanca", lat: 3.4151, lng: -76.4826 },
    { barrio: "Ladera", lat: 3.4702, lng: -76.5562 },
    { barrio: "Univalle", lat: 3.3742, lng: -76.5340 },
    { barrio: "Chipichape", lat: 3.4789, lng: -76.5272 },
    { barrio: "Pasoancho", lat: 3.3989, lng: -76.5241 },
];

interface MockExpert {
    firstName: string; lastName: string; phone: string;
    catId: string; subId: string; catName: string; subName: string;
    locIdx: number;
}

const MOCK_EXPERTS: MockExpert[] = [
    { firstName: "Juan", lastName: "Rodríguez", phone: "3001234501", catId: "cat-reparacion", subId: "sub-electricidad", catName: "Reparación y mantenimiento", subName: "Electricidad", locIdx: 0 },
    { firstName: "Carlos", lastName: "Martínez", phone: "3001234502", catId: "cat-reparacion", subId: "sub-plomeria", catName: "Reparación y mantenimiento", subName: "Plomería", locIdx: 1 },
    { firstName: "María", lastName: "González", phone: "3001234503", catId: "cat-cuidado", subId: "sub-enfermeria", catName: "Cuidado de personas y mascotas", subName: "Enfermería domiciliaria", locIdx: 2 },
    { firstName: "Pedro", lastName: "López", phone: "3001234504", catId: "cat-construccion", subId: "sub-pintura", catName: "Construcción e ingeniería", subName: "Pintura", locIdx: 3 },
    { firstName: "Lucía", lastName: "Ramírez", phone: "3001234505", catId: "cat-belleza", subId: "sub-peluqueria", catName: "Belleza, estética y cuidado personal", subName: "Peluquería a domicilio", locIdx: 4 },
    { firstName: "Andrés", lastName: "Herrera", phone: "3001234506", catId: "cat-mecanica", subId: "sub-mec-automotriz", catName: "Servicios de mecánica", subName: "Mecánica automotriz", locIdx: 5 },
    { firstName: "Diana", lastName: "Torres", phone: "3001234507", catId: "cat-limpieza", subId: "sub-limpieza-gral", catName: "Limpieza y mantenimiento del hogar", subName: "Limpieza general", locIdx: 6 },
    { firstName: "Felipe", lastName: "Castro", phone: "3001234508", catId: "cat-deporte", subId: "sub-entrenador", catName: "Deporte, bienestar y salud", subName: "Entrenador personal", locIdx: 7 },
    { firstName: "Valentina", lastName: "Moreno", phone: "3001234509", catId: "cat-agricultura", subId: "sub-jardineria", catName: "Agricultura y campo", subName: "Jardinería", locIdx: 8 },
    { firstName: "Jorge", lastName: "Jiménez", phone: "3001234510", catId: "cat-construccion", subId: "sub-albanileria", catName: "Construcción e ingeniería", subName: "Albañilería", locIdx: 9 },
    { firstName: "Sandra", lastName: "García", phone: "3001234511", catId: "cat-enfermeria", subId: "sub-enf-domicilio", catName: "Enfermería", subName: "Enfermería domiciliaria", locIdx: 0 },
    { firstName: "Miguel", lastName: "Vargas", phone: "3001234512", catId: "cat-soldadura", subId: "sub-soldadura-gral", catName: "Soldadura y metalurgia", subName: "Soldadura general", locIdx: 1 },
    { firstName: "Laura", lastName: "Ríos", phone: "3001234513", catId: "cat-asesoria", subId: "sub-contable", catName: "Asesoría financiera, legal y jurídica", subName: "Contabilidad", locIdx: 2 },
    { firstName: "Héctor", lastName: "Medina", phone: "3001234514", catId: "cat-reparacion", subId: "sub-refrigeracion", catName: "Reparación y mantenimiento", subName: "Refrigeración y A/C", locIdx: 3 },
    { firstName: "Paola", lastName: "Soto", phone: "3001234515", catId: "cat-belleza", subId: "sub-masajes", catName: "Belleza, estética y cuidado personal", subName: "Masajes terapéuticos", locIdx: 4 },
];

const MOCK_CLIENTS = [
    { firstName: "Ana", lastName: "Peña", phone: "3101234501" },
    { firstName: "Luis", lastName: "Gómez", phone: "3101234502" },
    { firstName: "Claudia", lastName: "Álvarez", phone: "3101234503" },
    { firstName: "Mario", lastName: "Ortiz", phone: "3101234504" },
    { firstName: "Natalia", lastName: "Cruz", phone: "3101234505" },
    { firstName: "Ricardo", lastName: "Reyes", phone: "3101234506" },
    { firstName: "Mónica", lastName: "Cárdenas", phone: "3101234507" },
    { firstName: "Jaime", lastName: "Parra", phone: "3101234508" },
    { firstName: "Gloria", lastName: "Gutiérrez", phone: "3101234509" },
    { firstName: "Sergio", lastName: "Mendoza", phone: "3101234510" },
];

async function seedUsers(): Promise<{ expertIds: string[] }> {
    const expertIds: string[] = [];

    // Seed experts
    for (let i = 0; i < MOCK_EXPERTS.length; i++) {
        const exp = MOCK_EXPERTS[i];
        const uid = `seed-expert-${String(i + 1).padStart(3, "0")}`;
        const loc = CALI_LOCATIONS[exp.locIdx];
        const h3Res9 = latLngToCell(loc.lat, loc.lng, 9);

        await db.collection("users").doc(uid).set({
            uid,
            displayName: `${exp.firstName} ${exp.lastName}`,
            firstName: exp.firstName,
            lastName: exp.lastName,
            email: `${uid}@seed.chambit.co`,
            phone: exp.phone,
            cc: `100000${String(i + 1).padStart(4, "0")}`,
            birthYear: 1985 + (i % 15),
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(exp.firstName + "+" + exp.lastName)}&background=34af00&color=fff`,
            role: "expert",
            preferredCategories: [exp.catId],
            expertPopupDismissals: 0,
            fcmToken: "",
            h3Res9,
            country: "CO",
            geozoneId: "cali-urban-v1",
            isExpertEnabled: true,
            createdAt: TS(),
            lastActiveAt: TS(),
            expert: {
                bio: `Experto en ${exp.subName} con amplia experiencia en Cali.`,
                educationLevel: ["tecnico"],
                coverageRadiusKm: 5,
                activeJobCount: 0,
                verified: true,
                verifiedAt: TS(),
                rating: 0,
                ratingCount: 0,
            },
        });
        expertIds.push(uid);
    }
    console.log(`✅ [D09] ${MOCK_EXPERTS.length} expert users seeded`);

    // Seed clients
    for (let i = 0; i < MOCK_CLIENTS.length; i++) {
        const cl = MOCK_CLIENTS[i];
        const uid = `seed-client-${String(i + 1).padStart(3, "0")}`;
        const loc = CALI_LOCATIONS[i % CALI_LOCATIONS.length];
        const h3Res9 = latLngToCell(loc.lat, loc.lng, 9);

        await db.collection("users").doc(uid).set({
            uid,
            displayName: `${cl.firstName} ${cl.lastName}`,
            firstName: cl.firstName,
            lastName: cl.lastName,
            email: `${uid}@seed.chambit.co`,
            phone: cl.phone,
            cc: `200000${String(i + 1).padStart(4, "0")}`,
            birthYear: 1990 + (i % 10),
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(cl.firstName + "+" + cl.lastName)}&background=0284c7&color=fff`,
            role: "client",
            preferredCategories: [],
            expertPopupDismissals: 0,
            fcmToken: "",
            h3Res9,
            country: "CO",
            geozoneId: "cali-urban-v1",
            isExpertEnabled: true,
            createdAt: TS(),
            lastActiveAt: TS(),
        });
    }
    console.log(`✅ [D09] ${MOCK_CLIENTS.length} client users seeded`);

    return { expertIds };
}

// ─── 5. SERVICE LISTINGS (D02) ────────────────────────────────────────────────
async function seedListings(expertIds: string[]): Promise<void> {
    for (let i = 0; i < MOCK_EXPERTS.length; i++) {
        const exp = MOCK_EXPERTS[i];
        const uid = expertIds[i];
        const loc = CALI_LOCATIONS[exp.locIdx];
        const h3Res7 = latLngToCell(loc.lat, loc.lng, 7);
        const h3Res9 = latLngToCell(loc.lat, loc.lng, 9);
        const listingId = `listing-${uid}`;

        const priceBase = 30_000 + (i * 5_000);

        await db.collection("serviceListings").doc(listingId).set({
            id: listingId,
            expertId: uid,
            expertName: `${exp.firstName} ${exp.lastName}`,
            expertAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(exp.firstName + "+" + exp.lastName)}&background=34af00&color=fff`,
            title: `${exp.subName} profesional en ${CALI_LOCATIONS[exp.locIdx].barrio}`,
            description: `Ofrezco servicios de ${exp.subName} con garantía y materiales de calidad. Atiendo en ${CALI_LOCATIONS[exp.locIdx].barrio} y alrededores.`,
            categoryId: exp.catId,
            subcategoryId: exp.subId,
            categoryName: exp.catName,
            subcategoryName: exp.subName,
            priceMin: priceBase,
            priceMid: Math.round(priceBase * 1.5),
            priceMax: priceBase * 2,
            priceHour: priceBase,
            educationLevel: "tecnico",
            rating: 0,
            ratingRaw: 0,
            ratingCount: 0,
            wilsonLB: 0,
            wilsonPositiveSum: 0,
            wilsonNegativeSum: 0,
            isActive: true,
            lastActiveAt: TS(),
            h3Index: h3Res7,
            h3Res9: h3Res9,
            h3Resolution: 7,
            citySlug: "cali",
            coverageRadiusKm: 5,
            imageUrl: null,
            createdAt: TS(),
        });
    }
    console.log(`✅ [D02] ${MOCK_EXPERTS.length} service listings seeded`);
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
    console.log("\n🚀 Chambit Seeder — target DB: test1 @ chambit-dev1\n");
    console.log("─".repeat(60));

    await seedConfig();
    await seedGeozones();
    await seedCategories();
    const { expertIds } = await seedUsers();
    await seedListings(expertIds);

    console.log("─".repeat(60));
    console.log("\n🏁 Seeding complete. Collections populated:");
    console.log("   • config/app");
    console.log("   • geozones (2)");
    console.log("   • categories (17) + subcategories (55)");
    console.log(`   • users — experts (${MOCK_EXPERTS.length}) + clients (${MOCK_CLIENTS.length})`);
    console.log(`   • serviceListings (${MOCK_EXPERTS.length})`);
    console.log("\n   ✅ Ready to test in Firebase Console → test1 database.\n");

    process.exit(0);
}

main().catch((err) => {
    console.error("❌ Seeder failed:", err);
    process.exit(1);
});
