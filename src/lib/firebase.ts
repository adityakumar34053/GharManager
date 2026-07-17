import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDdrFXhMlQ6wHysRAgpqe6wVqlinUVe9Tg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gharmanager.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gharmanager",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gharmanager.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1029450075667",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1029450075667:web:e854c9fd1749e3514fb9e6",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-GGBC6VSJJ9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const signInHidden = async (retries = 3) => {
  try {
    await signInAnonymously(auth);
  } catch (e: any) {
    console.error("Auth failed", e);
    if (e?.code === 'auth/network-request-failed' && retries > 0) {
      console.warn(`Network request failed, retrying... (${retries} attempts left)`);
      setTimeout(() => signInHidden(retries - 1), 2000);
    } else if (e?.code === 'auth/admin-restricted-operation' || e?.code === 'auth/configuration-not-found') {
      console.warn("FIREBASE SETUP REQUIRED: Please go to your Firebase Console -> Authentication -> Sign-in method, and enable 'Anonymous' authentication.");
    }
  }
};
