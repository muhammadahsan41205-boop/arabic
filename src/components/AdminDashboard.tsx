import React, { useState, useEffect } from 'react';
import { QuizResultRecord, AnnouncementItem, AppUser } from '../types/index.ts';
import {
  getAllQuizResultsAdmin,
  addAnnouncement,
  deleteAnnouncement,
} from '../services/firestoreService.ts';
import { generateAdaptiveQuiz, GeneratedQuestion } from '../services/apiService.ts';
import {
  ShieldCheck,
  Users,
  Award,
  Sparkles,
  Plus,
  Trash2,
  Send,
  Eye,
  RefreshCw,
  FileQuestion,
  GraduationCap,
} from 'lucide-react';

interface AdminDashboardProps {
  user: AppUser;
  announcements: AnnouncementItem[];
  onRefreshAnnouncements: () => void;
  onSwitchToStudentView: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  announcements,
  onRefreshAnnouncements,
  onSwitchToStudentView,
}) => {
  const [allResults, setAllResults] = useState<QuizResultRecord[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);

  // New Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annBadge, setAnnBadge] = useState('Penting');
  const [savingAnn, setSavingAnn] = useState(false);

  // Dynamic Quiz Generator State
  const [quizTopic, setQuizTopic] = useState('Isim Isyarah dan Dhomir Munfashil');
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  useEffect(() => {
    loadAllResults();
  }, []);

  const loadAllResults = async () => {
    setLoadingResults(true);
    try {
      const data = await getAllQuizResultsAdmin();
      setAllResults(data || []);
    } catch (err) {
      console.error('Error loading admin results:', err);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim() || savingAnn) return;

    setSavingAnn(true);
    try {
      await addAnnouncement({
        title: annTitle.trim(),
        content: annContent.trim(),
        author: user.displayName || 'Administrator MA Darul Faqih',
        createdAt: new Date().toISOString().split('T')[0],
        badge: annBadge,
      });
      setAnnTitle('');
      setAnnContent('');
      onRefreshAnnouncements();
    } catch (err) {
      console.error('Failed to create announcement:', err);
    } finally {
      setSavingAnn(false);
    }
  };

  const handleDeleteAnn = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus pengumuman ini?')) return;
    try {
      await deleteAnnouncement(id);
      onRefreshAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateAIQuiz = async () => {
    if (!quizTopic.trim() || generatingQuiz) return;
    setGeneratingQuiz(true);
    try {
      const qs = await generateAdaptiveQuiz(quizTopic, 3);
      setGeneratedQuestions(qs);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingQuiz(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-emerald-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/30 text-amber-200 text-xs font-bold border border-amber-400/30">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              Portal Khusus Administrator & Ustadz Pengampu
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Dashboard Guru & Manajemen Nilai
            </h1>
            <p className="text-emerald-100/90 text-xs sm:text-sm max-w-xl">
              Akun aktif: <b>{user.displayName || 'admin'}</b> (Kredensial bawaan: user: <b>admin</b> | pw: <b>admin123</b>). Pantau data santri di Firestore, kelola pengumuman, dan generate kuis AI.
            </p>
          </div>

          <button
            onClick={onSwitchToStudentView}
            className="px-4 py-2.5 rounded-xl bg-white text-slate-800 hover:bg-slate-100 font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start md:self-auto cursor-pointer"
          >
            <Eye className="w-4 h-4 text-emerald-700" />
            <span>Lihat Tampilan Siswa</span>
          </button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">
              Total Hasil Kuis Masuk
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {allResults.length} Submisi
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">
              Rata-rata Nilai Kelas X
            </span>
            <div className="text-2xl font-black text-emerald-700 mt-1">
              {allResults.length > 0
                ? Math.round(
                    allResults.reduce((acc, c) => acc + c.score, 0) / allResults.length
                  )
                : 0}{' '}
              <span className="text-xs text-slate-400 font-semibold">/ 100</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">
              Pengumuman Aktif
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {announcements.length} Informasi
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid: Announcements Manager & AI Quiz Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Announcement Manager */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-600" />
              Kirim Pengumuman Baru ke Santri
            </h2>
          </div>

          <form onSubmit={handleCreateAnnouncement} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Judul Pengumuman:
              </label>
              <input
                type="text"
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                placeholder="Contoh: Jadwal Ujian Tengah Semester Bahasa Arab"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori / Badge:
                </label>
                <select
                  value={annBadge}
                  onChange={(e) => setAnnBadge(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Penting">Penting</option>
                  <option value="Tugas">Tugas Santri</option>
                  <option value="Hafalan">Hafalan Mufradat</option>
                  <option value="Ujian">Ujian / Evaluasi</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={savingAnn || !annTitle.trim() || !annContent.trim()}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{savingAnn ? 'Menyimpan...' : 'Kirim'}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Isi Pengumuman / Instruksi:
              </label>
              <textarea
                rows={3}
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                placeholder="Tuliskan petunjuk tugas santri MA Darul Faqih di sini..."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </form>

          {/* List of Current Announcements */}
          <div className="pt-3 border-t border-slate-100 space-y-2 max-h-48 overflow-y-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Daftar Pengumuman Aktif ({announcements.length}):
            </span>
            {announcements.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-800">{item.title}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold">
                      {item.badge || 'Info'}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5 line-clamp-1">{item.content}</p>
                </div>
                <button
                  onClick={() => handleDeleteAnn(item.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Hapus pengumuman"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI Quiz Generator */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Pembuat Soal Kuis AI (Gemini 3.8 Flash)
            </h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Topik Materi Ujian:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  placeholder="Contoh: Jumlah Fi'liyyah dan Maf'ul Bih"
                  className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={handleGenerateAIQuiz}
                  disabled={generatingQuiz || !quizTopic.trim()}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  <FileQuestion className="w-3.5 h-3.5" />
                  <span>{generatingQuiz ? 'Merumuskan...' : 'Buat Soal'}</span>
                </button>
              </div>
            </div>

            {/* Generated Quiz Preview */}
            {generatedQuestions.length > 0 && (
              <div className="pt-2 space-y-3 max-h-64 overflow-y-auto pr-1">
                <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{generatedQuestions.length} Soal Berhasil Dibuat:</span>
                </div>

                {generatedQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs space-y-1.5"
                  >
                    <div className="font-bold text-slate-900">
                      {idx + 1}. {q.question}
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[11px]">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-1.5 rounded-lg border ${
                            oIdx === q.correctIndex
                              ? 'bg-emerald-100 border-emerald-300 text-emerald-950 font-bold'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="font-arabic-inline">{opt}</span>
                          {oIdx === q.correctIndex && ' ✓'}
                        </div>
                      ))}
                    </div>
                    <div className="text-[10px] text-slate-500 italic">
                      Penjelasan: {q.explanation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Student Quiz Submissions Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              Rekapitulasi Nilai Seluruh Santri di Firestore
            </h2>
            <p className="text-xs text-slate-500">
              Data tersimpan otomatis setiap kali santri menyelesaikan kuis evaluasi
            </p>
          </div>

          <button
            onClick={loadAllResults}
            disabled={loadingResults}
            className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-slate-50 border border-slate-200"
            title="Segarkan data"
          >
            <RefreshCw className={`w-4 h-4 ${loadingResults ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-bold">
              <tr>
                <th className="p-3">Nama Santri</th>
                <th className="p-3">Materi / Bab</th>
                <th className="p-3">Benar</th>
                <th className="p-3">Nilai</th>
                <th className="p-3">Predikat</th>
                <th className="p-3">Waktu Pengerjaan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {allResults.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                    Belum ada submisi nilai kuis dari santri. Coba kerjakan kuis sebagai santri untuk melihat datanya tersimpan di sini!
                  </td>
                </tr>
              ) : (
                allResults.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">
                      {r.studentName}
                    </td>
                    <td className="p-3 text-slate-700 font-medium">
                      {r.babTitle}
                    </td>
                    <td className="p-3 text-slate-600">
                      {r.correctCount} / {r.totalQuestions}
                    </td>
                    <td className="p-3 font-extrabold text-emerald-700 text-sm">
                      {r.score}
                    </td>
                    <td className="p-3">
                      {r.score >= 80 ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          Mumtaz (A)
                        </span>
                      ) : r.score >= 60 ? (
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                          Jayyid (B)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-[10px]">
                          Remidial
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-400">
                      {new Date(r.completedAt).toLocaleString('id-ID', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
