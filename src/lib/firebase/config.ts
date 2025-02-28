import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Use environment variables or fallback to demo values in development
const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || (isDevelopment ? 'demo-api-key' : ''),
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || (isDevelopment ? 'demo-project.firebaseapp.com' : ''),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || (isDevelopment ? 'demo-project' : ''),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || (isDevelopment ? 'demo-project.appspot.com' : ''),
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || (isDevelopment ? '123456789' : ''),
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || (isDevelopment ? '1:123456789:web:abcdef123456' : ''),
};

// Initialize Firebase with error handling
let app;
let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

try {
  // Check if all required config values are present in production
  if (!isDevelopment) {
    const requiredFields = [
      'apiKey',
      'authDomain',
      'projectId',
      'storageBucket',
      'messagingSenderId',
      'appId',
    ] as const;

    for (const field of requiredFields) {
      if (!firebaseConfig[field]) {
        throw new Error(`Missing required Firebase config field: ${field}`);
      }
    }
  }

  // Initialize Firebase
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  
  // In development, create mock services
  if (isDevelopment) {
    console.warn('Using mock Firebase services for development');
    // These will be undefined, but the app won't crash
  } else {
    // In production, rethrow the error
    throw error;
  }
}

// Helper function to get Firestore instance
export const getFirestoreInstance = (): Firestore => {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }
  return db;
};

export { app, db, auth, storage }; 