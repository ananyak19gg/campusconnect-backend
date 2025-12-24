import * as admin from 'firebase-admin';

// This checks if Firebase is already initialized (by index.ts)
// If not, it uses the environment variable we added to Railway
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
  
  if (serviceAccount.project_id) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
}

export const db = admin.firestore();
export const auth = admin.auth();