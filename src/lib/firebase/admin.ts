import admin from 'firebase-admin';

// This guard prevents re-initialization on hot reloads
if (!admin.apps.length) {
  try {
    // Ensure all required environment variables are present
    if (
      !process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY
    ) {
      throw new Error('Missing Firebase Admin SDK credentials in environment.');
    }
    
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // The private key from the .env file needs newlines restored
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error. Firestore features will be disabled.', error);
  }
}

// Export firestore only if the app was successfully initialized.
export const firestore = admin.apps.length > 0 ? admin.firestore() : undefined;
