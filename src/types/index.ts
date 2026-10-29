export type UserRole = 'student' | 'admin';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  role: UserRole;
  isAdmin?: boolean;
  xp: number;
  streak: number;
  createdAt?: string;
  lastActive?: string;
}

export interface MufradatItem {
  id: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  category?: string;
  exampleArabic?: string;
  exampleMeaning?: string;
}

export interface HiwarLine {
  id: string;
  speaker: string;
  arabic: string;
  transliteration: string;
  translation: string;
}

export interface QawaidItem {
  id: string;
  title: string;
  arabicTitle: string;
  explanation: string;
  formula?: string;
  examples: {
    arabic: string;
    transliteration: string;
    translation: string;
    breakdown?: string;
  }[];
  tips?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  arabicText?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface BabModule {
  id: string;
  number: number;
  title: string;
  arabicTitle: string;
  description: string;
  theme: string;
  duration: string;
  mufradatList: MufradatItem[];
  hiwarDialog: HiwarLine[];
  qawaidList: QawaidItem[];
  quizQuestions: QuizQuestion[];
}

export interface UserBabProgress {
  userId: string;
  babId: string;
  isCompleted: boolean;
  score?: number;
  updatedAt: string;
}

export interface QuizResultRecord {
  id?: string;
  userId: string;
  studentName: string;
  babId: string;
  babTitle: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  completedAt: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  badge?: string;
}
