import React, { useState } from 'react';
import { BabModule, UserBabProgress } from '../types/index.ts';
import { audioService } from '../services/audioService.ts';
import {
  Volume2,
  BookOpen,
  MessageSquare,
  Sparkles,
  HelpCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  Lightbulb,
  Award,
} from 'lucide-react';

interface BabViewerProps {
  bab: BabModule;
  progress?: UserBabProgress;
  onBack: () => void;
  onStartQuiz: () => void;
}

export const BabViewer: React.FC<BabViewerProps> = ({
  bab,
  progress,
  onBack,
  onStartQuiz,
}) => {
  const [activeTab, setActiveTab] = useState<'mufradat' | 'hiwar' | 'qawaid'>('mufradat');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handlePlayAudio = async (id: string, text: string) => {
    setPlayingId(id);
    await audioService.playArabic(text);
    setPlayingId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Navigation & Bab Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 transition-colors mb-4 backdrop-blur-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Bab
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                <span>Bab {bab.number}</span>
                <span>•</span>
                <span>{bab.theme}</span>
                {progress?.isCompleted && (
                  <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-[11px] px-2 py-0.5 rounded-full border border-emerald-400/30">
                    <CheckCircle className="w-3 h-3" /> Tuntas
                  </span>
                )}
              </div>

              <div className="mt-2 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {bab.title}
                </h1>
                <span className="font-arabic text-3xl sm:text-4xl text-amber-300 font-bold" dir="rtl">
                  {bab.arabicTitle}
                </span>
              </div>

              <p className="text-emerald-100/90 text-sm mt-3 max-w-2xl leading-relaxed">
                {bab.description}
              </p>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-emerald-200 bg-white/10 px-3 py-1.5 rounded-xl">
                <Clock className="w-4 h-4 text-emerald-300" />
                <span>{bab.duration}</span>
              </div>

              <button
                onClick={onStartQuiz}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                {progress?.score !== undefined ? `Ulangi Kuis (Skor: ${progress.score})` : 'Mulai Kuis Evaluasi'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tabs Selector */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-xs">
        <button
          onClick={() => setActiveTab('mufradat')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'mufradat'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Mufradat (Kosakata)</span>
          <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-black/10">
            {bab.mufradatList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('hiwar')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'hiwar'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Hiwar (Percakapan)</span>
        </button>

        <button
          onClick={() => setActiveTab('qawaid')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'qawaid'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Qawa'id (Kaidah Nahwu)</span>
        </button>
      </div>

      {/* TAB 1: MUFRADAT (KOSAKATA) */}
      {activeTab === 'mufradat' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">
              Kosakata Utama & Contoh Penggunaan
            </h2>
            <span className="text-xs text-slate-500">
              Klik ikon speaker untuk mendengarkan lafal Arab
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bab.mufradatList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {item.category || 'Mufradat'}
                    </span>
                    <div className="text-slate-800 font-bold text-base sm:text-lg">
                      {item.meaning}
                    </div>
                    <div className="text-xs text-slate-500 italic">
                      "{item.transliteration}"
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => handlePlayAudio(item.id, item.arabic)}
                      className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                        playingId === item.id
                          ? 'bg-emerald-600 text-white animate-pulse'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                      title="Dengarkan lafal"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <span className="font-arabic text-2xl sm:text-3xl text-emerald-900 font-bold tracking-wide" dir="rtl">
                      {item.arabic}
                    </span>
                  </div>
                </div>

                {item.exampleArabic && (
                  <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/70 p-3 rounded-xl flex items-start justify-between gap-3">
                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-700 block mb-0.5">Contoh Kalimat:</span>
                      {item.exampleMeaning}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-arabic text-base sm:text-lg text-emerald-800 font-semibold" dir="rtl">
                        {item.exampleArabic}
                      </span>
                      <button
                        onClick={() => handlePlayAudio(`${item.id}-ex`, item.exampleArabic!)}
                        className="text-slate-400 hover:text-emerald-700 p-1"
                        title="Dengarkan contoh"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: HIWAR (PERCAKAPAN) */}
      {activeTab === 'hiwar' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Teks Percakapan (الْحِوَارُ)
                </h2>
                <p className="text-xs text-slate-500">
                  Perhatikan intonasi dan pengucapan antar tokoh santri di MA Darul Faqih
                </p>
              </div>
              <button
                onClick={() => {
                  const fullText = bab.hiwarDialog.map((l) => l.arabic).join(' ... ');
                  handlePlayAudio('all-hiwar', fullText);
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                Putar Semua Percakapan
              </button>
            </div>

            <div className="space-y-4">
              {bab.hiwarDialog.map((line, idx) => {
                const isLeft = idx % 2 === 0;
                return (
                  <div
                    key={line.id}
                    className={`flex items-start gap-3 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${
                        isLeft
                          ? 'bg-emerald-700 text-white'
                          : 'bg-teal-700 text-white'
                      }`}
                    >
                      {line.speaker.charAt(0)}
                    </div>

                    {/* Speech Bubble */}
                    <div
                      className={`max-w-xl rounded-2xl p-4 border transition-all ${
                        isLeft
                          ? 'bg-emerald-50/70 border-emerald-200/80 rounded-tl-none'
                          : 'bg-teal-50/70 border-teal-200/80 rounded-tr-none text-right'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="text-xs font-bold text-slate-700">
                          {line.speaker}
                        </span>
                        <button
                          onClick={() => handlePlayAudio(line.id, line.arabic)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            playingId === line.id
                              ? 'bg-emerald-600 text-white animate-pulse'
                              : 'text-slate-500 hover:text-emerald-700 hover:bg-white/80'
                          }`}
                          title="Dengar lafal percakapan"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Arabic Line */}
                      <div className="font-arabic text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed mb-2" dir="rtl">
                        {line.arabic}
                      </div>

                      {/* Transliteration & Translation */}
                      <div className="text-xs text-slate-500 italic mb-1">
                        "{line.transliteration}"
                      </div>
                      <div className="text-xs sm:text-sm text-slate-800 font-medium">
                        {line.translation}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QAWAID (KAIDAH NAHWU & SHOROF) */}
      {activeTab === 'qawaid' && (
        <div className="space-y-6">
          {bab.qawaidList.map((rule) => (
            <div
              key={rule.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Kaidah Nahwu & Shorof Kelas X
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {rule.title}
                  </h2>
                </div>
                <div className="font-arabic text-2xl text-emerald-800 font-bold" dir="rtl">
                  {rule.arabicTitle}
                </div>
              </div>

              <p className="text-slate-700 text-sm leading-relaxed">
                {rule.explanation}
              </p>

              {rule.formula && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
                  <div className="text-xs font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Rumus & Pola Kaidah:
                  </div>
                  <div className="font-mono text-sm sm:text-base font-semibold text-emerald-950 font-arabic-inline">
                    {rule.formula}
                  </div>
                </div>
              )}

              {/* Examples Breakdown */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Contoh Analisis Penerapan:
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {rule.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-sm font-bold text-slate-800">
                          {ex.translation}
                        </div>
                        <div className="text-xs text-slate-500 italic mt-0.5">
                          "{ex.transliteration}"
                        </div>
                        {ex.breakdown && (
                          <div className="text-xs text-emerald-800 bg-emerald-100/50 px-2.5 py-1 rounded-md mt-2 inline-block font-medium">
                            {ex.breakdown}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-arabic text-2xl text-emerald-900 font-bold" dir="rtl">
                          {ex.arabic}
                        </span>
                        <button
                          onClick={() => handlePlayAudio(`rule-${i}`, ex.arabic)}
                          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-700"
                          title="Dengarkan contoh kaidah"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {rule.tips && (
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Tips Memahami Santri: </span>
                    <span>{rule.tips}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Bottom CTA to start Quiz */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">
            Sudah Memahami Materi Bab Ini?
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Uji pemahamanmu dengan 5 soal kuis pilihan ganda dan raih skor tertinggi!
          </p>
        </div>
        <button
          onClick={onStartQuiz}
          className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Award className="w-4 h-4 text-amber-300" />
          Mulai Kuis Bab {bab.number}
        </button>
      </div>
    </div>
  );
};
