import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import { User } from "../../../shared/types";

export const onUserCreate = functions.auth.user().onCreate(async (user: admin.auth.UserRecord) => {
    const db = admin.firestore();

    const { uid, email, displayName, photoURL } = user;

    const newUser: User = {
        uid,
        email: email || "",
        displayName: displayName || "Usuario Nuevo",
        avatarUrl: photoURL || "", // Renamed property
        role: "client", // Default role

        // New required fields with default values
        phone: "",
        cc: "",
        birthYear: 0,
        h3Res9: "", // Location not set yet
        preferredCategories: [],
        expertPopupDismissals: 0,

        // Country & expert status defaults
        country: "CO",
        isExpertEnabled: false,

        createdAt: admin.firestore.FieldValue.serverTimestamp() as any,
        lastActiveAt: admin.firestore.FieldValue.serverTimestamp() as any, // Renamed from updatedAt
    };

    try {
        // Use merge: true to avoid overwriting if client already created it (race condition)
        await db.collection("users").doc(uid).set(newUser, { merge: true });
        console.log(`✅ Created/Synced user profile for ${uid} (${email})`);
    } catch (error) {
        console.error(`❌ Error creating user profile for ${uid}:`, error);
    }
});
