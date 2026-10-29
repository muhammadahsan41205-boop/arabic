import React from 'react';
import { AppUser } from '../types/index.ts';
import {
  BookOpen,
  Sparkles,
  MessageSquare,
  Award,
  Layers,
  ShieldCheck,
  LogOut,
  Flame,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';

interface NavbarProps {
  user: AppUser;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  completedBabsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onLogout,
  completedBabsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & School Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('materi')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
                  MA Darul Faqih
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Kelas X
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                اللُّغَةُ الْعَرَبِيَّةُ • Pembelajaran Bahasa Arab Interaktif
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setActiveTab('materi')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'materi'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Materi & Bab
            </button>

            <button
              onClick={() => setActiveTab('flashcards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'flashcards'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Layers className="w-4 h-4" />
              Kartu Hafalan
            </button>

            <button
              onClick={() => setActiveTab('tanya-ai')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'tanya-ai'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Tanya Ustadz AI
            </button>

            <button
              onClick={() => setActiveTab('muhadatsah')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'muhadatsah'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-teal-600" />
              Muhadatsah AI
            </button>

            <button
              onClick={() => setActiveTab('bedah-kalimat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'bedah-kalimat'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Bedah Kaidah
            </button>

            {user.isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'admin'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-amber-700 hover:bg-amber-100/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Panel Admin
              </button>
            )}
          </nav>

          {/* User Status & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* XP & Streak */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-medium bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200/60">
              <span className="flex items-center gap-1 font-bold text-amber-600">
                <Award className="w-3.5 h-3.5" />
                {user.xp || 50} XP
              </span>
              <span className="text-emerald-300">•</span>
              <span className="flex items-center gap-1 text-emerald-700">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                {user.streak || 1} Hari
              </span>
              <span className="text-emerald-300">•</span>
              <span className="text-slate-600">
                {completedBabsCount}/6 Bab
              </span>
            </div>

            {/* Profile Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs ring-2 ring-emerald-500/20">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-slate-800 truncate max-w-[120px]">
                  {user.displayName || 'Santri'}
                </div>
                <div className="text-[10px] text-emerald-600 font-medium">
                  {user.isAdmin ? 'Admin / Pengajar' : 'Siswa Kelas X'}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              title="Keluar dari akun"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors border border-red-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 bg-white px-2 py-2 overflow-x-auto text-[11px] font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('materi')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md ${
            activeTab === 'materi' ? 'text-emerald-700 font-bold bg-emerald-50' : ''
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Materi
        </button>
        <button
          onClick={() => setActiveTab('flashcards')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md ${
            activeTab === 'flashcards' ? 'text-emerald-700 font-bold bg-emerald-50' : ''
          }`}
        >
          <Layers className="w-4 h-4" />
          Hafalan
        </button>
        <button
          onClick={() => setActiveTab('tanya-ai')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md ${
            activeTab === 'tanya-ai' ? 'text-emerald-700 font-bold bg-emerald-50' : ''
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Tanya AI
        </button>
        <button
          onClick={() => setActiveTab('muhadatsah')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md ${
            activeTab === 'muhadatsah' ? 'text-emerald-700 font-bold bg-emerald-50' : ''
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Dialog
        </button>
        <button
          onClick={() => setActiveTab('bedah-kalimat')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md ${
            activeTab === 'bedah-kalimat' ? 'text-emerald-700 font-bold bg-emerald-50' : ''
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Kaidah
        </button>
        {user.isAdmin && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md ${
              activeTab === 'admin' ? 'text-amber-700 font-bold bg-amber-50' : 'text-amber-600'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Admin
          </button>
        )}
      </div>
    </header>
  );
};
