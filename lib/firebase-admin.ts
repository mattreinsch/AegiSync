
import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';

if (!process.env.FIREBASE_PROJECT_ID) {
  throw new Error('FIREBASE_PROJECT_ID is not set in .env');
}
if (!process.env.FIREBASE_CLIENT_EMAIL) {
    throw new Error('FIREBASE_CLIENT_EMAIL is not set in .env');
}
if (!process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error('FIREBASE_PRIVATE_KEY is not set in .env');
}

function initializeAdminApp() {
    if (admin.apps.length > 0) {
        return admin.app();
    }
    
    try {
        const app = admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }),
        });
        return app;
    } catch (error: any) {
        console.error('Firebase admin initialization error', error.stack);
        throw error;
    }
}

const adminApp = initializeAdminApp();
export const firestore = admin.firestore(adminApp);
export const auth = getAuth(adminApp);


// A helper function to manage session cookies for server-side authentication
export async function createSessionCookie(idToken: string) {
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await getAuth(adminApp).createSessionCookie(idToken, { expiresIn });
    cookies().set('__session', sessionCookie, { maxAge: expiresIn, httpOnly: true, secure: true });
}

export async function clearSessionCookie() {
    cookies().delete('__session');
}
