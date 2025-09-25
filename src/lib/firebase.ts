// This is a placeholder for your Firebase configuration.
// In a real application, you would replace the placeholder values
// with your actual Firebase project configuration and use environment variables
// to store sensitive information.

// 1. Go to your Firebase project settings.
// 2. In the "General" tab, find your app and click on "Config" in the "Firebase SDK snippet" section.
// 3. Copy the firebaseConfig object.
// 4. It's recommended to store these values in environment variables (e.g., in a .env.local file).

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-auth-domain",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-storage-bucket",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "your-messaging-sender-id",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "your-app-id",
};

// NOTE: In a real app, you would initialize Firebase here, for example:
/*
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const apps = getApps();
const app = !apps.length ? initializeApp(firebaseConfig) : apps[0];
const auth = getAuth(app);

export { app, auth };
*/

// For this scaffold, we are not initializing Firebase to avoid breaking the app
// without a valid config. The auth logic is mocked in `src/lib/auth.ts`.
