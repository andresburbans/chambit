"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut as firebaseSignOut
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { User } from "../../shared/types";

// Extended Auth Context Type
interface AuthContextType {
  user: User | null; // Our custom User type with roles
  firebaseUser: FirebaseUser | null; // Raw Firebase Auth user
  loading: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>; // To re-fetch role/data from Firestore
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const normalizeUser = (raw: Record<string, unknown>, authUser: FirebaseUser): User => {
    const safeRole = typeof raw.role === "string" ? raw.role : "";

    return {
      uid: authUser.uid,
      email: (raw.email as string) || authUser.email || "",
      displayName: (raw.displayName as string) || authUser.displayName || "Usuario",
      firstName: (raw.firstName as string) || undefined,
      lastName: (raw.lastName as string) || undefined,
      phone: (raw.phone as string) || "",
      cc: (raw.cc as string) || "",
      birthYear: typeof raw.birthYear === "number" ? raw.birthYear : 0,
      avatarUrl: (raw.avatarUrl as string) || (raw.photoURL as string) || authUser.photoURL || "",
      role: safeRole as User["role"],
      preferredCategories: Array.isArray(raw.preferredCategories) ? (raw.preferredCategories as string[]) : [],
      expertPopupDismissals: typeof raw.expertPopupDismissals === "number" ? raw.expertPopupDismissals : 0,
      fcmToken: (raw.fcmToken as string) || "",
      h3Res9: (raw.h3Res9 as string) || "",
      country: (raw.country as string) || "CO",
      geozoneId: (raw.geozoneId as string) || undefined,
      isExpertEnabled: typeof raw.isExpertEnabled === "boolean" ? raw.isExpertEnabled : true,
      createdAt: (raw.createdAt as User["createdAt"]) || ({ seconds: 0, nanoseconds: 0, toDate: () => new Date(0) } as User["createdAt"]),
      lastActiveAt: (raw.lastActiveAt as User["lastActiveAt"]) || ({ seconds: 0, nanoseconds: 0, toDate: () => new Date(0) } as User["lastActiveAt"]),
      expert: (raw.expert as User["expert"]) || undefined,
    };
  };

  // Function to fetch extended user profile from Firestore
  const fetchUserProfile = async (authUser: FirebaseUser) => {
    try {
      const userRef = doc(db, "users", authUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUser(normalizeUser(userSnap.data() as Record<string, unknown>, authUser));
      } else {
        // Minimal safe profile until onboarding creates the full document.
        setUser(normalizeUser({ role: "" }, authUser));
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    // Real-time listener for Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setFirebaseUser(authUser);

      if (authUser) {
        await fetchUserProfile(authUser);
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
  };

  const refreshProfile = async () => {
    if (firebaseUser) await fetchUserProfile(firebaseUser);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
