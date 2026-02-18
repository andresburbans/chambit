import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { latLngToCell } from "h3-js";
import { User, ExpertProfile } from "../../../shared/types";

// H3 Resolution for User Privacy/Matching (Resolution 9 = ~0.17km edge length)
const USER_H3_RESOLUTION = 9;

export const UserService = {
    /**
     * Updates user location converting GPS coordinates to H3 index.
     * Preserves privacy by storing cell index instead of raw coordinates usually.
     */
    async updateLocation(uid: string, lat: number, lng: number) {
        try {
            const h3Index = latLngToCell(lat, lng, USER_H3_RESOLUTION);

            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, {
                h3Res9: h3Index,
                lastActiveAt: new Date() // ServerTimestamp logic handled by caller or changed to client date for now
                // In real app, consider using serverTimestamp() from firebase/firestore
            });

            return h3Index;
        } catch (error) {
            console.error("Error updating location:", error);
            throw error;
        }
    },

    /**
     * Updates basic user profile information.
     */
    async updateProfile(uid: string, data: Partial<User>) {
        try {
            const userRef = doc(db, "users", uid);
            // Filter out fields that shouldn't be updated directly here (like role or rating)
            const { role, rating, reviewCount, ...safeData } = data as any;

            await updateDoc(userRef, safeData);
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    },

    /**
     * Updates or creates expert-specific profile data.
     */
    async updateExpertProfile(uid: string, expertData: Partial<ExpertProfile>) {
        try {
            const userRef = doc(db, "users", uid);
            // We store expert profile nested within the user document for efficiently
            // fetching all user data in one go (as defined in shared types).

            // First get current data to merge properly if needed, 
            // though updateDoc with dot notation "expert.field" is cleaner if structure exists.
            // But dot notation requires the map to exist. 
            // Safer to read-modify-write or use set with merge if structure is unknown, 
            // but updateDoc is standard for existing docs.

            // Using dot notation for nested updates map
            const updatePayload: any = {};

            if (expertData.educationLevel) updatePayload["expert.educationLevel"] = expertData.educationLevel;
            if (expertData.coverageRadiusKm) updatePayload["expert.coverageRadiusKm"] = expertData.coverageRadiusKm;
            // activeJobCount and verified are usually system managed, but allowing edit for MVP prototype if needed

            await updateDoc(userRef, updatePayload);
        } catch (error) {
            console.error("Error updating expert profile:", error);
            throw error;
        }
    },

    /**
     * Fetches full user profile
     */
    async getUser(uid: string): Promise<User | null> {
        const userRef = doc(db, "users", uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) return snap.data() as User;
        return null;
    }
};
