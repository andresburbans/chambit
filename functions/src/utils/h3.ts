/**
 * H3 Spatial Indexing Utilities (E03)
 *
 * Dual-resolution strategy:
 *   - Resolution 9 (storage): ~0.105 km², ~200m edge — privacy preserving
 *   - Resolution 7 (search):  ~5.16 km², ~1.4 km edge — efficient queries
 *
 * Implementation pending. See spec: docs/dev-specs/02-engine-backend/E03-h3-indexing.md
 */

// import { latLngToCell, cellToParent, gridDisk, cellToLatLng } from "h3-js";

export const H3_STORAGE_RES = 9;
export const H3_SEARCH_RES = 7;
export const H3_DEFAULT_KRING = 2;
