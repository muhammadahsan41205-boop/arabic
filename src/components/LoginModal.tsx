import React, { useState } from 'react';
import {
  GraduationCap,
  Shield,
  BookOpen,
  Sparkles,
  Lock,
  UserCheck,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface LoginModalProps {
  onGoogleLogin: () => Promise<void>;
  onAdminLogin: (user: string, pass: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  onGoogleLogin,
  onAdminLogin,
  loading,
  error: externalError,
}) => {
  const [activeTab, setActiveTab] = useState<'google' | 'admin'>('google');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!adminUsername.trim() || !adminPassword.trim()) {
      setLocalError('Mohon masukkan nama pengguna dan kata sandi admin.');
      return;
    }

    const success = await onAdminLogin(adminUsername.trim(), adminPassword.trim());
    if (!success) {
      setLocalError('Kredensial salah! Gunakan username: admin dan password: admin123');
    }
  };

  const handleAutoFillAdmin = () => {
    setAdminUsername('admin');
    setAdminPassword('admin123');
    setLocalError(null);
  };

  const currentError = localError || externalError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Decorative Islamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-400 blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-amber-400 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 flex flex-col md:flex-row">
        {/* Left Side: School Branding & Features Highlight */}
        <div className="md:w-5/12 bg-gradient-to-br from-emerald-800 via-emerald-900 to-teal-950 p-6 sm:p-8 text-white flex flex-col justify-between relative">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold">
              <GraduationCap className="w-4 h-4 text-emerald-300" />
              Madrasah Aliyah Darul Faqih
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Pembelajaran Bahasa Arab
              </h1>
              <p className="text-emerald-300 font-semibold text-sm mt-1">
                Kelas X (Sepuluh) MA Darul Faqih Indonesia
              </p>
              <div className="mt-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-700/40 text-center">
                <span className="font-arabic text-xl sm:text-2xl text-amber-300 font-bold block leading-relaxed">
                  تَعَلَّمُوا الْعَرَبِيَّةَ فَإِنَّهَا مِنْ دِينِكُمْ
                </span>
                <span className="text-[11px] text-emerald-200 block mt-1 italic">
                  "Pelajarilah bahasa Arab, karena ia adalah bagian dari agamamu."
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-emerald-100">
                <div className="w-6 h-6 rounded-lg bg-emerald-700/80 flex items-center justify-center shrink-0 text-amber-300">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <span>6 Bab Materi Kurikulum Kemenag Lengkap</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-emerald-100">
                <div className="w-6 h-6 rounded-lg bg-emerald-700/80 flex items-center justify-center shrink-0 text-amber-300">
                  <Flame className="w-3.5 h-3.5" />
                </div>
                <span>Lafal Audio Arab & Kartu Hafalan Interaktif</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-emerald-100">
                <div className="w-6 h-6 rounded-lg bg-emerald-700/80 flex items-center justify-center shrink-0 text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span>Tanya Ustadz AI & Muhadatsah Berbasis Gemini</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-emerald-100">
                <div className="w-6 h-6 rounded-lg bg-emerald-700/80 flex items-center justify-center shrink-0 text-amber-300">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <span>Penyimpanan Hasil Belajar & Skor di Firestore</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-emerald-800/80 text-[11px] text-emerald-300/80 flex items-center justify-between">
            <span>© MA Darul Faqih Indonesia</span>
            <span>Versi Kelas X 2026</span>
          </div>
        </div>

        {/* Right Side: Login Options */}
        <div className="md:w-7/12 p-6 sm:p-10 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center md:text-left mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Silakan Masuk ke Portal
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Halaman ini wajib login untuk mengakses materi, latihan soal, dan asisten AI santri.
              </p>
            </div>

            {/* Tab Selector */}
            <div className="flex rounded-xl bg-slate-100 p-1 mb-6 border border-slate-200/80">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('google');
                  setLocalError(null);
                }}
                className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'google'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4 text-emerald-600" />
                Login Siswa / Google
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('admin');
                  setLocalError(null);
                }}
                className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Shield className="w-4 h-4 text-amber-600" />
                Login Admin (user: admin)
              </button>
            </div>

            {currentError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                <span>{currentError}</span>
              </div>
            )}

            {/* Tab 1: Google Login */}
            {activeTab === 'google' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs text-slate-700 space-y-1.5">
                  <p className="font-semibold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Akses Santri & Pengajar
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Masuk menggunakan akun Google Anda. Progres belajar, skor kuis, dan poin pengalaman (XP) akan tersimpan secara otomatis di cloud Firestore.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onGoogleLogin}
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-xs hover:shadow transition-all flex items-center justify-center gap-3 disabled:opacity-60 cursor-pointer"
                >
                  {/* Google SVG Icon */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{loading ? 'Menghubungkan...' : 'Masuk dengan Akun Google'}</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('admin')}
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center gap-1"
                  >
                    Ingin masuk sebagai Administrator? Klik di sini
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Admin Login */}
            {activeTab === 'admin' && (
              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold">Kredensial Admin Khusus:</span>
                    <div className="text-[11px] mt-0.5 font-mono">user: <b>admin</b> | pw: <b>admin123</b></div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFillAdmin}
                    className="px-2.5 py-1 rounded-md bg-amber-200/80 hover:bg-amber-300 text-amber-900 font-semibold text-[11px] transition-colors"
                  >
                    Isi Otomatis
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Pengguna (Username)
                  </label>
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="Masukkan admin"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kata Sandi (Password)
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Masukkan admin123"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold text-sm shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Shield className="w-4 h-4" />
                  <span>{loading ? 'Memverifikasi...' : 'Masuk sebagai Admin'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
