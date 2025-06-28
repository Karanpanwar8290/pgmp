import admin from 'firebase-admin';

if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    // Throw a more specific error to guide the user.
    throw new Error('Firebase credentials are not set. Please create a .env.local file and add your FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.');
}

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Now that we've checked for existence, we can safely use the value.
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
    // Re-throw a generic error to avoid exposing too much detail.
    throw new Error('Failed to initialize Firebase Admin SDK. Please check if your credentials are correct.');
  }
}


export const firestore = admin.firestore();
