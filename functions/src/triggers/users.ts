import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import { cellToParent } from "h3-js";
/**
 * Parses a full display name string into firstName + lastName.
 * Strategy: split on the first space.
 * "María Claudia Ríos" → firstName: "María", lastName: "Claudia Ríos"
 * "Juan"               → firstName: "Juan",  lastName: ""
 */
function parseName(displayName: string): { firstName: string; lastName: string } {
    const trimmed = (displayName || "").trim();
    const spaceIndex = trimmed.indexOf(" ");
    if (spaceIndex === -1) {
        return { firstName: trimmed, lastName: "" };
    }
    return {
        firstName: trimmed.slice(0, spaceIndex).trim(),
        lastName: trimmed.slice(spaceIndex + 1).trim(),
    };
}

export const onUserCreate = functions.auth.user().onCreate(async (user: admin.auth.UserRecord) => {
    const db = admin.firestore();
    const { uid, email, displayName, photoURL } = user;

    const rawName = displayName || "";
    const { firstName, lastName } = parseName(rawName);

    const newUser: any = {
        uid,
        email: email || "",

        // Progressive Name Pattern:
        // displayName is always present from auth.
        // firstName/lastName parsed best-effort; user corrects in profile.
        displayName: rawName || "Usuario Nuevo",
        firstName,
        lastName,

        avatarUrl: photoURL || "",
        role: "client",
        phone: "",
        cc: "",
        birthYear: 0,
        preferredCategories: [],
        expertPopupDismissals: 0,
        fcmToken: "",

        // Geolocation — empty until the user grants GPS permission
        h3Res9: "",
        country: "CO",
        geozoneId: undefined,

        // Auto-enabled for Colombia. Admin can flip to false to suspend.
        isExpertEnabled: true,

        createdAt: admin.firestore.FieldValue.serverTimestamp() as any,
        lastActiveAt: admin.firestore.FieldValue.serverTimestamp() as any,
    };

    try {
        // merge: true avoids overwriting if client SDK already created the doc (race condition)
        await db.collection("users").doc(uid).set(newUser, { merge: true });
        console.log(`✅ Created user profile for ${uid} (${email}) — name: "${rawName}"`);
    } catch (error) {
        console.error(`❌ Error creating user profile for ${uid}:`, error);
    }
});

/**
 * Trigger: onUserUpdate
 * Purpose: Keep the search index (h3Index, res 7) synchronized if the user's privacy location (h3Res9) changes.
 */
export const onUserUpdate = functions.firestore.document("users/{userId}").onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Check if the user is an expert and their privacy location changed
    if (after.role === "both" || after.role === "expert") {
        if (before.h3Res9 !== after.h3Res9 && after.h3Res9) {
            console.log(`User ${context.params.userId} changed location. Recalculating h3Index...`);

            // Calculate the new resolution 7 index for search
            const newH3Index = cellToParent(after.h3Res9, 7);

            // Update the expert data
            return change.after.ref.update({
                "expert.h3Index": newH3Index,
                "expert.h3Resolution": 7
            });
        }
    }
    return null;
});

