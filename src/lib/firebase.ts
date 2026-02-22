import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (Singleton pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize App Check (Only in browser environment)
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
      isTokenAutoRefreshEnabled: true
    });
    console.log("🛡️ Firebase App Check initialized");
  } catch (e) {
    console.warn("Failed to initialize App Check", e);
  }
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Helper debug logging in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  console.log('🔥 Firebase initialized:', app.name);
  console.log('📦 Project ID:', firebaseConfig.projectId);
  // Connect to local emulator for functions
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  console.log('🔌 Connected to local Firebase Functions Emulator.');
}
