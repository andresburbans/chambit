/**
 * Image Upload Service (D10 — Frontend-First Architecture)
 * =========================================================
 * All images are processed CLIENT-SIDE before reaching Firebase Storage:
 *   1. Resized to target dimensions using Canvas API
 *   2. Converted to WebP (Canvas.toBlob + 'image/webp')
 *   3. EXIF metadata stripped (Canvas redraw = clean pixels only)
 *   4. Uploaded to Firebase Storage
 *   5. Returns permanent download URL
 *
 * Target specs per D10:
 *   avatar   → 200×200 px  / max 60 KB  / WebP quality 0.85
 *   service  → 1200px edge / max 350 KB / WebP quality 0.85
 *   evidence → 1200px edge / max 350 KB / WebP quality 0.82
 */

import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ImageUploadTarget = "avatar" | "service" | "evidence";

export interface ImageUploadResult {
    url: string;          // Firebase Storage download URL
    path: string;         // Storage path (for deletion)
    sizeKb: number;       // Final size after compression
    widthPx: number;
    heightPx: number;
}

interface TargetConfig {
    maxEdgePx: number;
    quality: number;      // WebP quality 0.0 – 1.0
    maxSizeKb: number;
    squareCrop: boolean;  // true = avatar (1:1 crop)
}

const TARGET_CONFIG: Record<ImageUploadTarget, TargetConfig> = {
    avatar: { maxEdgePx: 200, quality: 0.85, maxSizeKb: 60, squareCrop: true },
    service: { maxEdgePx: 1200, quality: 0.85, maxSizeKb: 350, squareCrop: false },
    evidence: { maxEdgePx: 1200, quality: 0.82, maxSizeKb: 350, squareCrop: false },
};

// ─── Client-side Processing ───────────────────────────────────────────────────

/**
 * Loads a File into an HTMLImageElement.
 */
function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image")); };
        img.src = url;
    });
}

/**
 * Resizes and optionally center-crops an image on a Canvas.
 * Returns canvas dimensions for blob extraction.
 */
function drawToCanvas(
    img: HTMLImageElement,
    config: TargetConfig
): { canvas: HTMLCanvasElement; width: number; height: number } {
    const canvas = document.createElement("canvas");
    const { naturalWidth: sw, naturalHeight: sh } = img;

    let sx = 0, sy = 0, sWidth = sw, sHeight = sh;
    let dWidth: number, dHeight: number;

    if (config.squareCrop) {
        // Center-crop to square before scaling (avatar)
        const edge = Math.min(sw, sh);
        sx = (sw - edge) / 2;
        sy = (sh - edge) / 2;
        sWidth = edge;
        sHeight = edge;
        dWidth = config.maxEdgePx;
        dHeight = config.maxEdgePx;
    } else {
        // Proportional scale, constrain longest edge
        const ratio = Math.min(config.maxEdgePx / sw, config.maxEdgePx / sh, 1);
        dWidth = Math.round(sw * ratio);
        dHeight = Math.round(sh * ratio);
    }

    canvas.width = dWidth;
    canvas.height = dHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");

    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, dWidth, dHeight);
    return { canvas, width: dWidth, height: dHeight };
}

/**
 * Converts canvas to WebP Blob. Progressively lowers quality if size exceeds limit.
 */
async function canvasToWebP(
    canvas: HTMLCanvasElement,
    quality: number,
    maxSizeKb: number,
    attempt = 0
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            async (blob) => {
                if (!blob) { reject(new Error("Canvas toBlob failed")); return; }

                const sizeKb = blob.size / 1024;
                if (sizeKb <= maxSizeKb || attempt >= 3 || quality <= 0.5) {
                    resolve(blob);
                    return;
                }
                // Retry with lower quality
                try {
                    const smaller = await canvasToWebP(canvas, quality - 0.1, maxSizeKb, attempt + 1);
                    resolve(smaller);
                } catch (e) {
                    reject(e);
                }
            },
            "image/webp",
            quality
        );
    });
}

/**
 * Full client-side pipeline: File → resize → crop → WebP → Blob.
 */
export async function processImage(
    file: File,
    target: ImageUploadTarget
): Promise<{ blob: Blob; width: number; height: number; sizeKb: number }> {
    const config = TARGET_CONFIG[target];
    const img = await loadImage(file);
    const { canvas, width, height } = drawToCanvas(img, config);
    const blob = await canvasToWebP(canvas, config.quality, config.maxSizeKb);
    return { blob, width, height, sizeKb: blob.size / 1024 };
}

// ─── Upload Helpers ───────────────────────────────────────────────────────────

/**
 * Builds the Storage path for each upload target.
 */
function buildPath(target: ImageUploadTarget, uid: string, id?: string): string {
    switch (target) {
        case "avatar":
            return `avatars/${uid}.webp`;
        case "service":
            return `services/${uid}/${id ?? "default"}.webp`;
        case "evidence":
            return `requests/${id ?? "unknown"}/evidence.webp`;
    }
}

/**
 * Processes and uploads an image to Firebase Storage.
 *
 * @param file     - Raw file from <input type="file">
 * @param target   - "avatar" | "service" | "evidence"
 * @param uid      - Current user's UID
 * @param id       - listingId (service) or requestId (evidence)
 * @returns        - Download URL, path, and size metadata
 *
 * @example
 * const result = await uploadImage(file, "avatar", user.uid);
 * await UserService.updateProfile(user.uid, { avatarUrl: result.url });
 */
export async function uploadImage(
    file: File,
    target: ImageUploadTarget,
    uid: string,
    id?: string
): Promise<ImageUploadResult> {
    if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are supported.");
    }

    // 1. Process client-side (resize + WebP + strip EXIF)
    const { blob, width, height, sizeKb } = await processImage(file, target);

    // 2. Build storage path
    const path = buildPath(target, uid, id);
    const storageRef = ref(storage, path);

    // 3. Upload
    await uploadBytes(storageRef, blob, {
        contentType: "image/webp",
        customMetadata: { uploadedBy: uid, target, processedAt: Date.now().toString() },
    });

    // 4. Get permanent download URL
    const url = await getDownloadURL(storageRef);

    return { url, path, sizeKb: Math.round(sizeKb * 10) / 10, widthPx: width, heightPx: height };
}

/**
 * Deletes an image from Firebase Storage by its path.
 * Used when replacing an image or deleting a listing.
 */
export async function deleteImage(path: string): Promise<void> {
    try {
        await deleteObject(ref(storage, path));
    } catch {
        // Non-critical — file may not exist yet
        console.warn(`[ImageService] Could not delete ${path} — may not exist.`);
    }
}
