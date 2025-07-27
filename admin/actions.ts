'use server';

import { firestore } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';

// Helper function to verify if a user is an admin
async function verifyAdmin(uid: string): Promise<boolean> {
  if (!uid) return false;
  const userDoc = await firestore.collection('users').doc(uid).get();
  const userData = userDoc.data();
  return userData?.role === 'admin';
}

// Action to get all users
export async function getAllUsers(adminUid: string) {
  const isAdmin = await verifyAdmin(adminUid);
  if (!isAdmin) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const usersSnapshot = await firestore.collection('users').get();
    const users = usersSnapshot.docs.map(doc => ({
      uid: doc.id,
      email: doc.data().email, // Make sure to get email
      ...doc.data(),
    }));
    return { success: true, users };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { success: false, error: 'Failed to fetch users.' };
  }
}

// Action to update user access
export async function updateUserAccess(adminUid: string, targetUserId: string, status: 'active' | 'inactive') {
  const isAdmin = await verifyAdmin(adminUid);
  if (!isAdmin) {
    return { success: false, error: 'Unauthorized' };
  }
  
  // Prevent admin from revoking their own access
  if (adminUid === targetUserId && status === 'inactive') {
      return { success: false, error: "Admins cannot revoke their own access." };
  }

  try {
    await firestore.collection('users').doc(targetUserId).update({
      subscriptionStatus: status,
    });
    revalidatePath('/admin'); // Revalidate the admin page to show updated status
    return { success: true };
  } catch (error) {
    console.error('Error updating user access:', error);
    return { success: false, error: 'Failed to update user access.' };
  }
}
