/**
 * Frontend Type Definitions
 *
 * Re-exports shared types and adds frontend-specific types.
 * The canonical type definitions live in /shared/types.ts
 *
 * NOTE: During migration, we keep backward-compatible aliases below.
 * These will be gradually replaced with the shared types.
 */

// TODO: Once Firebase is connected, replace these with:
// export type { User, ServiceListing, ServiceRequest } from "../../shared/types";

// ============================================================
// Legacy types (used by current mock UI — will be migrated)
// ============================================================

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: "client" | "expert";
};

export type Service = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  priceType: "fixed" | "hourly" | "negotiable";
  rating: number;
  reviewCount: number;
  location: string;
  expert: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  imageUrl: string;
  imageHint: string;
};

export type ServiceRequest = {
  id: string;
  serviceTitle: string;
  expertName: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  date: string;
  offeredPrice: number;
};

export type Opportunity = {
  id: string;
  serviceTitle: string;
  clientName: string;
  status: "pending" | "accepted" | "rejected";
  date: string;
  offeredPrice: number;
};
