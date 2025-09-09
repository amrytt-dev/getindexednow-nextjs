import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;

export function initFirebaseClient(): {
  app: FirebaseApp | null;
  auth: Auth | null;
} {
  if (typeof window === "undefined") {
    return { app: null, auth: null };
  }

  if (!firebaseApp) {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

    if (!apiKey || !authDomain || !projectId || !appId) {
      // Not configured; leave Firebase disabled on client
      return { app: null, auth: null };
    }

    const config = {
      apiKey,
      authDomain,
      projectId,
      appId,
      // Optional but commonly present:
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    } as any;

    firebaseApp = getApps().length ? getApps()[0] : initializeApp(config);
    firebaseAuth = getAuth(firebaseApp);
  }

  return { app: firebaseApp, auth: firebaseAuth };
}

export function getFirebaseAuth(): Auth | null {
  if (!firebaseAuth) {
    const { auth } = initFirebaseClient();
    return auth;
  }
  return firebaseAuth;
}
