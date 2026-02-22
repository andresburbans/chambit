/**
 * Chambit Shared Types
 *
 * These types are used by BOTH the frontend (Next.js) and backend (Cloud Functions).
 * When you modify a type here, both sides stay in sync automatically.
 *
 * Organized by Firestore collection as defined in:
 *   docs/dev-specs/03-data-foundation/D01-D09
 */

// ============================================================
// D01 — Users Collection
// ============================================================

export type UserRole = "client" | "expert" | "both";

export type EducationLevel =
    | "bachiller"
    | "tecnico"
    | "tecnologo"
    | "profesional"
    | "especialista"
    | "magister"
    | "doctorado";

export interface User {
    uid: string;

    // ── Identity ──────────────────────────────────────────────────────────────
    // displayName: synched from Firebase Auth (Google) or entered at registration.
    // On first login it holds the full name as a single string.
    // firstName / lastName: populated when the user edits their profile.
    // Rule: displayName ALWAYS mirrors `${firstName} ${lastName}` after first edit.
    displayName: string;        // Full display name — present from day 1
    firstName?: string;         // Set on profile completion (optional until then)
    lastName?: string;          // Set on profile completion (optional until then)

    email: string;
    phone: string;              // 10-digit Colombian phone (starts with 3)
    cc: string;                 // Cédula de ciudadanía (6–12 digits). For future KYC.
    birthYear: number;          // >= 18 years old
    avatarUrl: string;
    role: UserRole;

    // ── Preferences ───────────────────────────────────────────────────────────
    preferredCategories: string[];  // Up to 5 category IDs
    expertPopupDismissals: number;  // Counter: 0–5, then stop showing the popup

    // ── Push Notifications ────────────────────────────────────────────────────
    fcmToken?: string;           // Firebase Cloud Messaging token. Frontend writes this.

    // ── Geolocation (H3 — never raw GPS) ─────────────────────────────────────
    h3Res9: string;              // H3 cell at Res 9 (~170m). Empty string until user sets location.
    country: string;             // ISO 3166-1 alpha-2 (e.g., "CO"). Derived from GPS on client.
    geozoneId?: string;          // FK → geozones/{id}. Set when expert is linked to a zone.

    // ── Expert Access Control ─────────────────────────────────────────────────
    // isExpertEnabled: auto-true if GPS is inside Colombia (validated on client).
    // Can be manually set to false by admin to suspend an expert account.
    isExpertEnabled: boolean;

    // ── Timestamps ────────────────────────────────────────────────────────────
    createdAt: FirebaseTimestamp;
    lastActiveAt: FirebaseTimestamp;  // Updated by client SDK — no Cloud Function needed.

    // ── Expert Sub-Object (only when role includes 'expert') ──────────────────
    expert?: ExpertProfile;
}

export interface ExpertProfile {
    // Profile
    bio?: string;                   // Public professional description
    educationLevel: EducationLevel[];
    coverageRadiusKm: number;       // How far the expert will travel

    // State
    activeJobCount: number;         // In-progress jobs right now. MVP max: 1
    verified: boolean;              // KYC verification status
    verifiedAt?: FirebaseTimestamp; // When they were verified

    // Reputation (maintained by Cloud Function on each new Rating)
    rating: number;                 // Bayesian average (0–5). Default: 0
    ratingCount: number;            // Total ratings received. Default: 0
}

// ============================================================
// D02 — Service Listings (Denormalized for Search)
// ============================================================

export interface ServiceListing {
    id: string;
    expertId: string;
    expertName: string; // Denormalized
    expertAvatar: string; // Denormalized
    title: string;
    description: string;
    categoryId: string;
    subcategoryId: string;
    categoryName: string; // Denormalized
    subcategoryName: string; // Denormalized
    priceMin: number;
    priceMid: number;
    priceMax: number;
    priceHour: number;
    educationLevel: EducationLevel;
    rating: number; // Bayesian Average (E04) — PRIMARY display value
    ratingRaw: number; // Simple average
    ratingCount: number;
    wilsonLB: number; // Wilson Lower Bound (E04) — confidence
    wilsonPositiveSum: number;
    wilsonNegativeSum: number;
    isActive: boolean;
    lastActiveAt: FirebaseTimestamp;
    h3Index: string; // Resolution 7 — for search queries (E03)
    h3Res9: string; // Resolution 9 — for distance calculation (E03)
    h3Resolution: number;
    citySlug: string;
    coverageRadiusKm: number;
    imageUrl: string | null;
    createdAt: FirebaseTimestamp;
}

// ============================================================
// D03 — Requests (Service Transactions)
// ============================================================

export type RequestStatus =
    | "pending"
    | "counteroffered"
    | "accepted"
    | "in_progress"
    | "completed"
    | "rejected"
    | "cancelled";

export interface ServiceRequest {
    id: string;
    listingId: string;
    clientId: string;
    clientName: string;
    expertId: string;
    expertName: string;
    serviceTitle: string;
    subcategoryId: string;
    offeredPrice: number;
    counterPrice?: number;
    finalPrice?: number;
    problemDescription: string;
    problemImageUrl?: string;
    preferredDate?: FirebaseTimestamp;
    status: RequestStatus;
    negotiationRound: number;
    clientH3Res9: string; // Privacy — NOT raw GPS
    distanceKm: number;
    createdAt: FirebaseTimestamp;
    updatedAt: FirebaseTimestamp;
    matchedAt?: FirebaseTimestamp;
    completedAt?: FirebaseTimestamp;
    ratingId?: string;
}

// ============================================================
// D04 — Ratings
// ============================================================

export interface Rating {
    id: string;
    requestId: string;
    clientId: string;
    expertId: string;
    listingId: string;
    subcategoryId: string;
    score: number; // 1-5
    comment?: string;
    createdAt: FirebaseTimestamp;
}

// ============================================================
// D05 — Categories & Subcategories
// ============================================================

export interface Category {
    id: string;
    name: string;
    icon: string;
    order: number;
}

export interface Subcategory {
    id: string;
    name: string;
    categoryId: string;
    prc: number | null; // Precio de Referencia de Calidad (E08)
    prcLastUpdated?: FirebaseTimestamp;
    expertCount: number;
}

// ============================================================
// D07 — Geozones (Authorized Operating Areas)
// ============================================================

export interface Geozone {
    id: string;
    name: string;        // "Santiago de Cali"
    citySlug: string;    // "cali"
    country: "CO";
    active: boolean;
    center: { lat: number, lng: number };
    zoom: number;        // Default dashboard zoom
    // List of H3 Res 7 indices that cover the authorized area
    // Using Res 7 for the boundary check is performance-efficient
    boundaryH3: string[];
    createdAt: FirebaseTimestamp;
}

// ============================================================
// D06 — App Config
// ============================================================

export interface AppConfig {
    minHourPrice: number; // Legal minimum (9,000 COP)
    maxHourPrice: number;
    maxDayPrice: number;
    prcDiscountFloor: number; // 0.80 = 80%
    enableWilsonFilter: boolean;
    enableLTR: boolean;
    ltrUserThreshold: number;
    h3SearchRes: number;
    h3StorageRes: number;
    h3KRingSize: number;
    h3MaxKRingSize: number;
    bayesianM: number;
    globalAvgRating: number;
    wilsonConfidence: number;
    wilsonMinThreshold: number;
    maxNegotiationRounds: number;
    maxActiveJobs: number;
    activityHalfLifeHours: number;
    scoringWeights: ScoringWeights;
}

export interface ScoringWeights {
    distance: number;
    reputation: number;
    activity: number;
    categoryMatch: number;
    availability: number;
}

// ============================================================
// Notifications
// ============================================================

export type NotificationType =
    | "new_request"
    | "request_accepted"
    | "request_rejected"
    | "counteroffer"
    | "service_completed"
    | "rate_prompt";

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    data?: Record<string, string>;
    read: boolean;
    pushSent: boolean;
    createdAt: FirebaseTimestamp;
}

// ============================================================
// Search Results (E02 response shape)
// ============================================================

export interface SearchResult {
    listingId: string;
    totalScore: number;
    distanceKm: number;
    signals: {
        distance: number;
        reputation: number;
        activity: number;
        categoryMatch: number;
        availability: number;
    };
}

export interface SearchResponse {
    results: SearchResult[];
    totalCandidates: number;
    kRingUsed: number;
    executionMs: number;
}

// ============================================================
// Utility Types
// ============================================================

// Firebase Timestamp compatibility
export interface FirebaseTimestamp {
    seconds: number;
    nanoseconds: number;
    toDate: () => Date;
}
