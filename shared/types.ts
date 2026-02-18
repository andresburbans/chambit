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
    name: string;
    email: string;
    phone: string;
    cc: string;
    birthYear: number;
    avatarUrl: string;
    role: UserRole;
    h3Res9: string; // Privacy-preserving location (E03)
    preferredCategories: string[]; // Up to 5 category IDs
    createdAt: FirebaseTimestamp;
    lastActiveAt: FirebaseTimestamp;
    expertPopupDismissals: number;
    expert?: ExpertProfile;
}

export interface ExpertProfile {
    educationLevel: EducationLevel[];
    coverageRadiusKm: number;
    activeJobCount: number;
    verified: boolean;
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
