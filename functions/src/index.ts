import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
// Automatically uses GOOGLE_APPLICATION_CREDENTIALS env var locally or GCP identity in production
admin.initializeApp();

// Export triggers
export * from "./triggers/users";
export * from "./triggers/notifications";

// Export callables (Data Engine)
export * from "./callables/search";
export * from "./callables/requests";
