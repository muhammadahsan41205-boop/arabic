import React from 'react';
import { BabModule, UserBabProgress, QuizResultRecord, AnnouncementItem, AppUser } from '../types/index.ts';
import {
  BookOpen,
  Award,
  Flame,
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Bell,
  GraduationCap,
} from 'lucide-react';

interface StudentDashboardProps {
  user: AppUser;
  babs: BabModule[];
  progressMap: Record<string, UserBabProgress>;
  quizHistory: QuizResultRecord[];
  announcements: AnnouncementItem[];
  onSelectBab: (bab: BabModule) => void;
  onStartQuiz: (bab: BabModule) => void;
  onExploreAI: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  babs,
  progressMap,
  quizHistory,
  announcements,
  onSelectBab,
  onStartQuiz,
  onExploreAI,
}) => {
  const completedCount = Object.values(progressMap).filter((p) => p.isCompleted).length;

  const averageScore =
    quizHistory.length > 0
      ? Math.round(
          quizHistory.reduce((acc, curr) => acc + curr.score, 0) / quizHistory.length
        )
      : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold">
              <GraduationCap className="w-4 h-4 text-emerald-300" />
              Kurikulum Resmi MA Darul Faqih Indonesia
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Ahlan wa Sahlan,{' '}
              <span className="text-amber-300">{user.displayName || 'Santri'}</span>!
            </h1>

            <p className="text-emerald-100/90 text-sm leading-relaxed">
              Tingkatkan kefasihan dan pemahaman bahasa Al-Qur'an melalui 6 bab pembelajaran interaktif, lafal audio, kartu hafalan, dan asisten AI pintar.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectBab(babs[0])}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                Lanjutkan Belajar Bab 1
              </button>
              <button
                onClick={onExploreAI}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                Coba Tanya Ustadz AI
              </button>
            </div>
          </div>

          {/* Quick Stats Pill Panel */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0 bg-white/10 p-4 sm:p-5 rounded-2xl border border-white/15 backdrop-blur-md">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider block">
                Bab Tuntas
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {completedCount}{' '}
                <span className="text-xs text-emerald-300 font-medium">/ 6 Bab</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider block">
                Rata-rata Nilai
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-300">
                {averageScore}{' '}
                <span className="text-xs text-emerald-300 font-medium">/ 100</span>
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t border-white/10">
              <span className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider block">
                Poin Pengalaman
              </span>
              <div className="text-xl font-bold text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                {user.xp || 50} XP
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t border-white/10">
              <span className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider block">
                Keaktifan Belajar
              </span>
              <div className="text-xl font-bold text-orange-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                {user.streak || 1} Hari
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements Section */}
      {announcements.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              Pengumuman & Instruksi Madrasah
            </h2>
            <span className="text-xs text-slate-400">MA Darul Faqih</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {announcements.slice(0, 3).map((ann) => (
              <div
                key={ann.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {ann.badge || 'Info'}
                  </span>
                  <span className="text-[10px] text-slate-400">{ann.createdAt}</span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  {ann.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {ann.content}
                </p>
                <div className="text-[11px] text-emerald-700 font-semibold pt-1">
                  — {ann.author}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6 Bab Curriculum Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Modul Pembelajaran Kelas X
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Silabus semester 1 & 2 Bahasa Arab MA Darul Faqih Indonesia
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            6 Modul Lengkap
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {babs.map((bab) => {
            const progress = progressMap[bab.id];
            const isDone = progress?.isCompleted;
            const score = progress?.score;

            return (
              <div
                key={bab.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-emerald-300 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Top tags */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      Bab {bab.number}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isDone ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Tuntas {score !== undefined && `(${score})`}
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {bab.duration}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Titles */}
                  <div>
                    <div
                      className="font-arabic text-2xl sm:text-3xl font-bold text-emerald-950 mb-1"
                      dir="rtl"
                    >
                      {bab.arabicTitle}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {bab.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {bab.description}
                  </p>

                  {/* Highlights list */}
                  <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded">
                      {bab.mufradatList.length} Mufradat
                    </span>
                    <span>•</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">
                      {bab.hiwarDialog.length} Percakapan
                    </span>
                    <span>•</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">
                      {bab.qawaidList.length} Kaidah
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onSelectBab(bab)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Pelajari Materi</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onStartQuiz(bab)}
                    className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                    title="Uji pemahaman kuis"
                  >
                    <Award className="w-4 h-4 text-amber-500" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quiz History Table */}
      {quizHistory.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Riwayat Nilai Evaluasi Santri
            </h2>
            <span className="text-xs text-slate-400">Tersimpan di Cloud Firestore</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold">
                <tr>
                  <th className="p-3">Materi / Bab</th>
                  <th className="p-3">Benar</th>
                  <th className="p-3">Skor Akhir</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Waktu Pengerjaan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {quizHistory.slice(0, 5).map((q, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-800">
                      {q.babTitle}
                    </td>
                    <td className="p-3 text-slate-600">
                      {q.correctCount} / {q.totalQuestions}
                    </td>
                    <td className="p-3 font-bold text-emerald-700 text-sm">
                      {q.score}
                    </td>
                    <td className="p-3">
                      {q.score >= 60 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" /> Tuntas
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          Perlu Pengayaan
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-400">
                      {new Date(q.completedAt).toLocaleString('id-ID', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
