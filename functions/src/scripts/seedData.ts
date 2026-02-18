import * as admin from "firebase-admin";
import { latLngToCell } from "h3-js";

// Import types directly from shared since this script runs in node environment
// Note: You might need to adjust paths or compile if running as a standalone script
// For simplicity, I'm defining a minified version of the logic here.

async function seedInitialData() {
    const db = admin.firestore();

    console.log("🚀 Starting seeding process...");

    // 1. Create Cali Geozone
    const caliId = "cali-urban-v1";
    // Approx center of Cali (San Fernando area)
    const caliCenter = { lat: 3.4372, lng: -76.5225 };

    // Some representative H3 Res 7 cells for Cali
    // These should be calculated using your OSM script later
    const caliH3Cells = [
        "87668d600ffffff", // Center
        "87668d601ffffff",
        "87668d604ffffff",
        "87668d605ffffff",
        "87668d606ffffff"
    ];

    await db.collection("geozones").doc(caliId).set({
        id: caliId,
        name: "Santiago de Cali (Urbano)",
        citySlug: "cali",
        country: "CO",
        active: true,
        center: caliCenter,
        zoom: 13,
        boundaryH3: caliH3Cells,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log("✅ Geozone Cali created.");

    // 2. Create Categories (D05)
    const categories = [
        { id: "cat-hogar", name: "Hogar y Construcción", icon: "home", order: 1 },
        { id: "cat-tech", name: "Tecnología y Soporte", icon: "laptop", order: 2 },
        { id: "cat-bienestar", name: "Bienestar y Cuidado", icon: "heart", order: 3 }
    ];

    for (const cat of categories) {
        await db.collection("categories").doc(cat.id).set(cat);
    }
    console.log("✅ Categories created.");

    // 3. Create 5 Mock Experts in Cali
    const mockExperts = [
        { name: "Juan Electricista", lat: 3.4400, lng: -76.5300, bio: "Experto en redes eléctricas" },
        { name: "Maria Tech", lat: 3.4200, lng: -76.5100, bio: "Reparación de computadores" },
        { name: "Carlos Plomero", lat: 3.4600, lng: -76.5200, bio: "20 años de experiencia" },
        { name: "Lucia Cuidadora", lat: 3.4500, lng: -76.5400, bio: "Enfermera profesional" },
        { name: "Pedro Pintor", lat: 3.4000, lng: -76.4900, bio: "Pintura y acabados" }
    ];

    for (const data of mockExperts) {
        const uid = `mock-expert-${Math.random().toString(36).substring(7)}`;
        const h3Res9 = latLngToCell(data.lat, data.lng, 9);

        await db.collection("users").doc(uid).set({
            uid,
            displayName: data.name,
            email: `${uid}@example.com`,
            role: "expert",
            avatarUrl: `https://placehold.co/100x100?text=${data.name.substring(0, 1)}`,
            h3Res9: h3Res9,
            country: "CO",
            isExpertEnabled: true,
            geozoneId: caliId,
            bio: data.bio,
            rating: 4.5,
            reviewCount: 10,
            expert: {
                educationLevel: ["tecnico"],
                coverageRadiusKm: 5,
                activeJobCount: 0,
                verified: true
            },
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            lastActiveAt: admin.firestore.FieldValue.serverTimestamp()
        });
    }
    console.log("✅ Mock experts created in Cali.");

    console.log("🏁 Seeding finished successfully.");
}

// Check if running directly
if (require.main === module) {
    // This requires prior admin.initializeApp()
    // seedInitialData();
}

export { seedInitialData };
