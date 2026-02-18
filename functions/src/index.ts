import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
// Automatically uses GOOGLE_APPLICATION_CREDENTIALS env var locally or GCP identity in production
admin.initializeApp();

// Export triggers
export * from "./triggers/users";

// TODO: Export other modules as we implement them (E02, E05, etc.)
// export * from "./search/searchExperts";
// export * from "./transactions";
