import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

if (!admin.apps.length) {
    try {
        // If SERVICE_ACCOUNT_JSON is provided as string
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        } else {
            // Fallback for local dev if GOOGLE_APPLICATION_CREDENTIALS is set
            // or just use default (might fail if not configured)
            admin.initializeApp();
            console.warn("FIREBASE_SERVICE_ACCOUNT not found, using default credentials");
        }
    } catch (error) {
        console.error("Firebase Admin Init Error:", error);
    }
}

export const auth = admin.auth();
export default admin;
