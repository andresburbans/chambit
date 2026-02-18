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

  // Function to fetch extended user profile from Firestore
  const fetchUserProfile = async (uid: string) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUser(userSnap.data() as User);
      } else {
        // Fallback if generic profile doesn't exist yet (race condition with cloud function)
        console.warn("User profile not found in Firestore yet. Waiting for trigger...");
        // Temporary minimalist user while Cloud Function runs
        setUser({
          uid: uid,
          email: firebaseUser?.email || "",
          displayName: firebaseUser?.displayName || "Usuario",
          role: "client", // Default pending sync
          photoURL: firebaseUser?.photoURL || "",
          metadata: { creationTime: firebaseUser?.metadata.creationTime },
        } as unknown as User);
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
        await fetchUserProfile(authUser.uid);
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
    if (firebaseUser) await fetchUserProfile(firebaseUser.uid);
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
