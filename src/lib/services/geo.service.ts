import { cellToParent, gridDisk, latLngToCell } from "h3-js";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { Geozone } from "../../../shared/types";

export const GeoService = {
    // Resolutions used in Chambit
    STORAGE_RES: 9, // ~0.17km edge
    INDEX_RES: 7,   // ~1.2km edge - Used for Geozone boundaries and fast search

    /**
   * Validates if a coordinate is within Colombia.
   * Bounding box check (approximate for performance, can be refined with H3 Res 2/3 whitelist)
   */
    isPointInColombia(lat: number, lng: number): boolean {
        const minLat = -4.2, maxLat = 13.5;
        const minLng = -79.0, maxLng = -66.8;
        return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
    },

    /**
     * Validates if a coordinate is suitable for expert registration.
     * Now allows any location within Colombia for the main project.
     */
    async validateExpertLocation(lat: number, lng: number): Promise<{ country: string, status: 'allowed' | 'restricted' }> {
        if (this.isPointInColombia(lat, lng)) {
            return { country: 'CO', status: 'allowed' };
        }
        return { country: 'OUTSIDE', status: 'restricted' };
    },

    /**
     * Retrieves all active geozones for mapping in Dashboard
     */
    async getActiveGeozones(): Promise<Geozone[]> {
        const geozonesRef = collection(db, "geozones");
        const q = query(geozonesRef, where("active", "==", true));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => d.data() as Geozone);
    }
};
