import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        } else {
            console.warn("FIREBASE_SERVICE_ACCOUNT_JSON missing. Admin features may fail.");
        }
    } catch (error) {
        console.error("Firebase Admin Init Error:", error);
    }
}

export const auth = admin.apps.length ? admin.auth() : null;
export default admin;
