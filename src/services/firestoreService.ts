import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config.ts';
import { AppUser, UserBabProgress, QuizResultRecord, AnnouncementItem } from '../types/index.ts';

// Get or sync User Profile
export async function syncUserProfile(user: AppUser): Promise<AppUser> {
  const path = `users/${user.uid}`;
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userDocRef);

    if (snap.exists()) {
      const data = snap.data();
      const updatedUser: AppUser = {
        ...user,
        role: data.role || user.role,
        isAdmin: data.role === 'admin' || user.isAdmin,
        xp: data.xp ?? user.xp,
        streak: data.streak ?? user.streak,
        createdAt: data.createdAt || new Date().toISOString(),
        lastActive: new Date().toISOString(),
      };
      await updateDoc(userDocRef, {
        lastActive: new Date().toISOString(),
        displayName: user.displayName || data.displayName || 'Santri MA Darul Faqih',
      });
      return updatedUser;
    } else {
      // New user registration in Firestore
      const newUserDoc = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Santri MA Darul Faqih',
        role: user.role,
        xp: user.xp || 10,
        streak: 1,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      };
      await setDoc(userDocRef, newUserDoc);
      return { ...user, ...newUserDoc };
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Save Bab Progress
export async function saveBabProgress(
  userId: string,
  babId: string,
  score: number,
  isCompleted: boolean
): Promise<void> {
  const path = `users/${userId}/progress/${babId}`;
  try {
    const progressRef = doc(db, 'users', userId, 'progress', babId);
    await setDoc(
      progressRef,
      {
        userId,
        babId,
        score,
        isCompleted,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // Also award XP to user
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const currentXp = userSnap.data().xp || 0;
      await updateDoc(userRef, {
        xp: currentXp + (isCompleted ? 50 : 20),
        lastActive: new Date().toISOString(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Fetch all Bab Progress for a specific user
export async function getUserProgress(userId: string): Promise<Record<string, UserBabProgress>> {
  const path = `users/${userId}/progress`;
  try {
    const progressCol = collection(db, 'users', userId, 'progress');
    const snapshot = await getDocs(progressCol);
    const result: Record<string, UserBabProgress> = {};
    snapshot.forEach((d) => {
      const data = d.data() as UserBabProgress;
      result[data.babId] = data;
    });
    return result;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// Record Quiz Result in Firestore
export async function recordQuizResult(result: QuizResultRecord): Promise<void> {
  const path = 'quizResults';
  try {
    const colRef = collection(db, 'quizResults');
    await addDoc(colRef, {
      ...result,
      completedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Fetch Quiz History for User
export async function getUserQuizResults(userId: string): Promise<QuizResultRecord[]> {
  const path = 'quizResults';
  try {
    const q = query(
      collection(db, 'quizResults'),
      where('userId', '==', userId),
      limit(20)
    );
    const snapshot = await getDocs(q);
    const list: QuizResultRecord[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...(d.data() as QuizResultRecord) });
    });
    return list.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// Admin only: Fetch all student quiz results across the madrasah
export async function getAllQuizResultsAdmin(): Promise<QuizResultRecord[]> {
  const path = 'quizResults';
  try {
    const q = query(collection(db, 'quizResults'), limit(50));
    const snapshot = await getDocs(q);
    const list: QuizResultRecord[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...(d.data() as QuizResultRecord) });
    });
    return list.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// Fetch Announcements
export async function getAnnouncements(): Promise<AnnouncementItem[]> {
  const path = 'announcements';
  try {
    const colRef = collection(db, 'announcements');
    const snapshot = await getDocs(colRef);
    const list: AnnouncementItem[] = [];
    snapshot.forEach((d) => {
      const data = d.data();
      list.push({
        id: d.id,
        title: data.title || '',
        content: data.content || '',
        author: data.author || 'Ustadz MA Darul Faqih',
        createdAt: data.createdAt || new Date().toISOString(),
        badge: data.badge || 'Info',
      });
    });
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// Admin: Add Announcement
export async function addAnnouncement(item: Omit<AnnouncementItem, 'id'>): Promise<void> {
  const path = 'announcements';
  try {
    const colRef = collection(db, 'announcements');
    await addDoc(colRef, {
      ...item,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Admin: Delete Announcement
export async function deleteAnnouncement(id: string): Promise<void> {
  const path = `announcements/${id}`;
  try {
    const docRef = doc(db, 'announcements', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
