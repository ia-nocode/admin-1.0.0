import { collection, getDocs, query, where, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { db } from '../lib/firebase';
import { getUserManagementAuth, cleanupUserManagementAuth } from './auth';
import type { User, Role } from '../types/user';

export async function fetchUsers(): Promise<User[]> {
  const usersCollection = collection(db, 'users');
  const snapshot = await getDocs(usersCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    lastUpdated: doc.data().lastUpdated?.toDate() || new Date()
  })) as User[];
}

export async function createUser(
  email: string,
  password: string,
  role: Role,
  firstName: string,
  lastName: string,
  mobile: string
): Promise<void> {
  let managementAuth = null;
  try {
    managementAuth = getUserManagementAuth();
    const userCredential = await createUserWithEmailAndPassword(managementAuth, email, password);
    const { uid } = userCredential.user;

    const userDoc = {
      userId: uid,
      email,
      firstName,
      lastName,
      mobile,
      role,
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp()
    };

    await addDoc(collection(db, 'users'), userDoc);
    
    if (managementAuth.currentUser) {
      await managementAuth.signOut();
    }
  } catch (error) {
    if (managementAuth?.currentUser) {
      try {
        await deleteUser(managementAuth.currentUser);
      } catch (cleanupError) {
        console.error('Error cleaning up auth user:', cleanupError);
      }
    }
    throw error;
  } finally {
    cleanupUserManagementAuth();
  }
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const updateData = {
    ...updates,
    lastUpdated: serverTimestamp()
  };
  await updateDoc(userRef, updateData);
}

export async function deleteUserDoc(userId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', userId));
}