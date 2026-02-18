/**
 * Chambit Cloud Functions — Entry Point
 *
 * All Cloud Functions are exported from this file.
 * Firebase CLI reads this to determine which functions to deploy.
 *
 * Structure:
 *   /functions/src/index.ts        ← You are here (exports)
 *   /functions/src/search/         ← E02: searchExperts
 *   /functions/src/transactions/   ← E05, E06, E07: request lifecycle
 *   /functions/src/triggers/       ← E10: Firestore triggers
 *   /functions/src/scheduled/      ← E08: PRC weekly recalculation
 *   /functions/src/utils/          ← E03, E04, E09: shared logic
 */

import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK (uses service account from environment)
admin.initializeApp();

// Export the Firestore and Auth references for use across functions
export const db = admin.firestore();
export const auth = admin.auth();

// ============================================================
// Cloud Functions will be exported here as they are implemented.
// Example (uncomment when E02 is ready):
//
// export { searchExperts } from "./search/searchExperts";
// export { createRequest } from "./transactions/createRequest";
// export { respondRequest } from "./transactions/respondRequest";
// export { completeAndRate } from "./transactions/completeAndRate";
// export { onUserCreate, onServiceCreate } from "./triggers";
// export { calculatePRC } from "./scheduled/prcCalculation";
// ============================================================
