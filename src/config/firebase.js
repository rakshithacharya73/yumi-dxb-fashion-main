import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if valid Firebase credentials exist
export const isFirebaseEnabled = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY'
);

let app = null;
let firestoreDb = null;
let firebaseAuth = null;

if (isFirebaseEnabled) {
  try {
    app = initializeApp(firebaseConfig);
    firestoreDb = getFirestore(app);
    firebaseAuth = getAuth(app);
    console.log('🔥 Firebase Cloud Database connected successfully!');
  } catch (error) {
    console.warn('⚠️ Firebase initialization warning:', error.message);
  }
} else {
  console.log('📦 Firebase credentials not detected. Running in LocalStorage Database Mode.');
}

export { app, firestoreDb as db, firebaseAuth as auth };
