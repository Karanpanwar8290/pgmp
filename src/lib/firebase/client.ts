import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;

// Check if all necessary client-side Firebase environment variables are set
if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    // Initialize Firebase
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    firestore = getFirestore(app);
  } catch (e) {
    console.error("Firebase initialization error:", e);
    // Log helpful message for the user.
    console.error(`
      ----------------------------------------------------------------
      !!! FIREBASE CLIENT-SIDE INITIALIZATION FAILED !!!
      ----------------------------------------------------------------
      This is likely due to incorrect or missing Firebase credentials.
      Please check your '.env.local' file and ensure the following
      environment variables are set correctly:

      NEXT_PUBLIC_FIREBASE_API_KEY="..."
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
      NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
      NEXT_PUBLIC_FIREBASE_APP_ID="..."

      You can get these values from your Firebase project's settings.
      The application will not function correctly until this is resolved.
      ----------------------------------------------------------------
    `);
  }
} else {
    console.warn(`
      ----------------------------------------------------------------
      !!! FIREBASE CLIENT-SIDE CONFIGURATION MISSING !!!
      ----------------------------------------------------------------
      Your Firebase client-side configuration is missing or incomplete.
      Authentication and database features will be disabled.
      Please create a '.env.local' file in the root of your project
      and add the necessary Firebase environment variables.
      ----------------------------------------------------------------
    `);
}


export { app, auth, firestore };
