import admin from 'firebase-admin';

// Initialize Firebase Admin SDK only once
if (admin.apps.length === 0) {
  // Check if credentials are provided. If not, Firestore will be unavailable.
  // This prevents crashing the app and allows for graceful error handling.
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    } catch (error) {
      console.error('Firebase admin initialization error. Please check your credentials in .env.local', error);
    }
  } else {
    console.warn('Firebase credentials are not set in .env.local. Firestore features will be disabled.');
  }
}

// Export firestore only if the app was successfully initialized.
export const firestore = admin.apps.length > 0 ? admin.firestore() : undefined;
