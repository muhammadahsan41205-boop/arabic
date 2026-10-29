/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
} from './firebase/config.ts';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { AppUser, BabModule, UserBabProgress, QuizResultRecord, AnnouncementItem } from './types/index.ts';
import { BAB_MODULES, INITIAL_ANNOUNCEMENTS } from './data/curriculumData.ts';
import {
  syncUserProfile,
  getUserProgress,
  getUserQuizResults,
  getAnnouncements,
} from './services/firestoreService.ts';

import { Navbar } from './components/Navbar.tsx';
import { LoginModal } from './components/LoginModal.tsx';
import { StudentDashboard } from './components/StudentDashboard.tsx';
import { BabViewer } from './components/BabViewer.tsx';
import { QuizSection } from './components/QuizSection.tsx';
import { FlashcardsSection } from './components/FlashcardsSection.tsx';
import { AskUstadzAI } from './components/AskUstadzAI.tsx';
import { MuhadatsahAI } from './components/MuhadatsahAI.tsx';
import { GrammarCheckerAI } from './components/GrammarCheckerAI.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';

export default function App() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // App navigation state
  const [activeTab, setActiveTab] = useState<string>('materi');
  const [selectedBab, setSelectedBab] = useState<BabModule | null>(null);
  const [activeQuizBab, setActiveQuizBab] = useState<BabModule | null>(null);

  // Firestore user progress & announcements
  const [progressMap, setProgressMap] = useState<Record<string, UserBabProgress>>({});
  const [quizHistory, setQuizHistory] = useState<QuizResultRecord[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(INITIAL_ANNOUNCEMENTS);

  // Listen to Firebase Auth state
  useEffect(() => {
    // Check if custom admin session is saved locally
    const savedAdminSession = localStorage.getItem('darulfaqih_admin_session');
    if (savedAdminSession) {
      try {
        const parsed: AppUser = JSON.parse(savedAdminSession);
        setUser(parsed);
        loadUserData(parsed.uid);
        setAuthLoading(false);
        return;
      } catch {
        localStorage.removeItem('darulfaqih_admin_session');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const isAdminEmail =
          fbUser.email === 'muhammad.ahsan41205@guru.smp.belajar.id' ||
          fbUser.email === 'admin@darulfaqih.sch.id';

        const baseUser: AppUser = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || 'Santri MA Darul Faqih',
          photoURL: fbUser.photoURL,
          role: isAdminEmail ? 'admin' : 'student',
          isAdmin: isAdminEmail,
          xp: 25,
          streak: 1,
        };

        try {
          const synced = await syncUserProfile(baseUser);
          setUser(synced);
          await loadUserData(synced.uid);
        } catch (err) {
          console.error('Failed to sync profile on login:', err);
          setUser(baseUser);
        }
      } else {
        // If not custom admin, user is logged out
        const localAdmin = localStorage.getItem('darulfaqih_admin_session');
        if (!localAdmin) {
          setUser(null);
        }
      }
      setAuthLoading(false);
    });

    // Also load initial announcements
    loadAnnouncements();

    return () => unsubscribe();
  }, []);

  const loadUserData = async (uid: string) => {
    try {
      const [prog, results] = await Promise.all([
        getUserProgress(uid).catch(() => ({})),
        getUserQuizResults(uid).catch(() => []),
      ]);
      if (prog) setProgressMap(prog);
      if (results) setQuizHistory(results);
    } catch (err) {
      console.warn('Could not load user data from Firestore:', err);
    }
  };

  const loadAnnouncements = async () => {
    try {
      const data = await getAnnouncements();
      if (data && data.length > 0) {
        setAnnouncements(data);
      }
    } catch (err) {
      console.warn('Using default announcements:', err);
    }
  };

  // Google Sign-In handler
  const handleGoogleLogin = async () => {
    setLoginLoading(true);
    setAuthError(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const fbUser = res.user;

      const isAdminEmail =
        fbUser.email === 'muhammad.ahsan41205@guru.smp.belajar.id' ||
        fbUser.email === 'admin@darulfaqih.sch.id';

      const baseUser: AppUser = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || 'Santri MA Darul Faqih',
        photoURL: fbUser.photoURL,
        role: isAdminEmail ? 'admin' : 'student',
        isAdmin: isAdminEmail,
        xp: 30,
        streak: 1,
      };

      const synced = await syncUserProfile(baseUser);
      setUser(synced);
      await loadUserData(synced.uid);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setAuthError(
        err.message || 'Gagal masuk dengan akun Google. Silakan coba lagi.'
      );
    } finally {
      setLoginLoading(false);
    }
  };

  // Dedicated Admin Login handler (user: admin, pw: admin123)
  const handleAdminLogin = async (usernameInput: string, passwordInput: string): Promise<boolean> => {
    setLoginLoading(true);
    setAuthError(null);

    // Validate credentials requested by user
    if (usernameInput === 'admin' && passwordInput === 'admin123') {
      const adminUser: AppUser = {
        uid: 'admin_darulfaqih',
        email: 'admin@darulfaqih.sch.id',
        displayName: 'Administrator MA Darul Faqih',
        role: 'admin',
        isAdmin: true,
        xp: 999,
        streak: 30,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('darulfaqih_admin_session', JSON.stringify(adminUser));
      setUser(adminUser);
      setActiveTab('admin'); // Directly open Admin Panel for admin

      try {
        await syncUserProfile(adminUser);
        await loadUserData(adminUser.uid);
      } catch (e) {
        console.warn('Admin profile synced in memory:', e);
      }

      setLoginLoading(false);
      return true;
    } else {
      setLoginLoading(false);
      return false;
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      localStorage.removeItem('darulfaqih_admin_session');
      await signOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
    }
    setUser(null);
    setSelectedBab(null);
    setActiveQuizBab(null);
    setActiveTab('materi');
  };

  // Completed Babs Count
  const completedBabsCount = Object.values(progressMap).filter((p) => p.isCompleted).length;

  // Show loading skeleton while verifying auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 animate-spin mx-auto flex items-center justify-center text-white">
            <span className="font-arabic text-xl font-bold">ف</span>
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-slate-800">
              Memuat Portal MA Darul Faqih...
            </h2>
            <p className="text-xs text-slate-400">
              Menghubungkan ke layanan cloud Firebase & Firestore
            </p>
          </div>
        </div>
      </div>
    );
  }

  // MANDATORY LOGIN GATE: If user is not authenticated, show Login Screen
  if (!user) {
    return (
      <LoginModal
        onGoogleLogin={handleGoogleLogin}
        onAdminLogin={handleAdminLogin}
        loading={loginLoading}
        error={authError}
      />
    );
  }

  // AUTHENTICATED APPLICATION
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedBab(null);
          setActiveQuizBab(null);
        }}
        onLogout={handleLogout}
        completedBabsCount={completedBabsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* TAB 1: MATERI & BAB */}
        {activeTab === 'materi' && (
          <>
            {activeQuizBab ? (
              <QuizSection
                bab={activeQuizBab}
                user={user}
                onFinish={async () => {
                  await loadUserData(user.uid);
                }}
                onCancel={() => setActiveQuizBab(null)}
              />
            ) : selectedBab ? (
              <BabViewer
                bab={selectedBab}
                progress={progressMap[selectedBab.id]}
                onBack={() => setSelectedBab(null)}
                onStartQuiz={() => setActiveQuizBab(selectedBab)}
              />
            ) : (
              <StudentDashboard
                user={user}
                babs={BAB_MODULES}
                progressMap={progressMap}
                quizHistory={quizHistory}
                announcements={announcements}
                onSelectBab={(bab) => setSelectedBab(bab)}
                onStartQuiz={(bab) => setActiveQuizBab(bab)}
                onExploreAI={() => setActiveTab('tanya-ai')}
              />
            )}
          </>
        )}

        {/* TAB 2: FLASHCARDS (KARTU HAFALAN) */}
        {activeTab === 'flashcards' && <FlashcardsSection />}

        {/* TAB 3: TANYA USTADZ AI (GEMINI 3.8 FLASH) */}
        {activeTab === 'tanya-ai' && <AskUstadzAI />}

        {/* TAB 4: MUHADATSAH AI (INTERACTIVE DIALOGUE) */}
        {activeTab === 'muhadatsah' && <MuhadatsahAI />}

        {/* TAB 5: BEDAH KAIDAH & TASHKIL */}
        {activeTab === 'bedah-kalimat' && <GrammarCheckerAI />}

        {/* TAB 6: ADMIN PANEL (GURU / ADMINISTRATOR) */}
        {activeTab === 'admin' && (
          <AdminDashboard
            user={user}
            announcements={announcements}
            onRefreshAnnouncements={loadAnnouncements}
            onSwitchToStudentView={() => setActiveTab('materi')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-700">
            MA Darul Faqih Indonesia • Portal Pembelajaran Bahasa Arab Kelas X
          </p>
          <p className="text-[11px] text-slate-400">
            Terhubung ke Firebase Auth, Firestore Database & Server-Side Gemini API Engine.
          </p>
        </div>
      </footer>
    </div>
  );
}
