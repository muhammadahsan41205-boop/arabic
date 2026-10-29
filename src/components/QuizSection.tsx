import React, { useState } from 'react';
import { BabModule, QuizQuestion, AppUser } from '../types/index.ts';
import { saveBabProgress, recordQuizResult } from '../services/firestoreService.ts';
import { audioService } from '../services/audioService.ts';
import {
  Award,
  CheckCircle,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Volume2,
  Clock,
  ArrowLeft,
} from 'lucide-react';

interface QuizSectionProps {
  bab: BabModule;
  user: AppUser;
  onFinish: (score: number) => void;
  onCancel: () => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  bab,
  user,
  onFinish,
  onCancel,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [saving, setSaving] = useState(false);

  const questions: QuizQuestion[] = bab.quizQuestions;
  const currentQ = questions[currentIndex];
  const selectedOption = selectedAnswers[currentIndex];
  const hasAnswered = selectedOption !== undefined;

  const handleSelectOption = (optIndex: number) => {
    if (showExplanation || isCompleted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optIndex,
    }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct += 1;
      }
    });
    return {
      correctCount: correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
    };
  };

  const finishQuiz = async () => {
    setIsCompleted(true);
    setSaving(true);
    const result = calculateScore();
    const passed = result.percentage >= 60;

    try {
      // Save progress to Firestore for this user
      await saveBabProgress(user.uid, bab.id, result.percentage, passed);
      await recordQuizResult({
        userId: user.uid,
        studentName: user.displayName || 'Santri MA Darul Faqih',
        babId: bab.id,
        babTitle: bab.title,
        score: result.percentage,
        totalQuestions: result.total,
        correctCount: result.correctCount,
        completedAt: new Date().toISOString(),
      });
      onFinish(result.percentage);
    } catch (err) {
      console.error('Gagal menyimpan hasil kuis:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setShowExplanation(false);
    setIsCompleted(false);
    setCurrentIndex(0);
  };

  const scoreData = calculateScore();

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <button
          onClick={onCancel}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Keluar dari Kuis
        </button>

        <div className="text-center">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
            Evaluasi Bab {bab.number}
          </span>
          <span className="text-sm font-extrabold text-slate-800">
            {bab.title}
          </span>
        </div>

        <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
          {currentIndex + 1} / {questions.length} Soal
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div
          className="bg-emerald-600 h-2 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Quiz Body or Completion Card */}
      {!isCompleted ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {/* Question Text */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pertanyaan #{currentIndex + 1}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h2>

            {currentQ.arabicText && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between gap-4">
                <span className="font-arabic text-2xl sm:text-3xl text-emerald-950 font-bold leading-relaxed" dir="rtl">
                  {currentQ.arabicText}
                </span>
                <button
                  onClick={() => audioService.playArabic(currentQ.arabicText!)}
                  className="p-2 rounded-xl bg-white text-emerald-800 hover:bg-emerald-100 shadow-xs cursor-pointer shrink-0"
                  title="Dengarkan lafal pertanyaan"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((opt, oIdx) => {
              const isSelected = selectedOption === oIdx;
              const isCorrect = oIdx === currentQ.correctIndex;

              let style = 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50 text-slate-800';

              if (showExplanation) {
                if (isCorrect) {
                  style = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                } else if (isSelected && !isCorrect) {
                  style = 'border-red-400 bg-red-50 text-red-900';
                } else {
                  style = 'border-slate-200 opacity-60 text-slate-500';
                }
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(oIdx)}
                  disabled={showExplanation}
                  className={`w-full p-4 rounded-2xl border text-left text-sm sm:text-base transition-all flex items-center justify-between gap-3 cursor-pointer ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="font-arabic-inline text-base sm:text-lg">
                      {opt}
                    </span>
                  </div>

                  {showExplanation && (
                    <div>
                      {isCorrect && (
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {showExplanation && (
            <div
              className={`p-4 rounded-2xl border text-xs sm:text-sm animate-fadeIn space-y-1.5 ${
                selectedOption === currentQ.correctIndex
                  ? 'bg-emerald-50/90 border-emerald-300 text-emerald-900'
                  : 'bg-amber-50/90 border-amber-300 text-amber-900'
              }`}
            >
              <div className="font-bold flex items-center gap-2">
                {selectedOption === currentQ.correctIndex ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Mumtaz! Jawaban Anda Benar</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span>Afwan, Jawaban Belum Tepat</span>
                  </>
                )}
              </div>
              <p className="leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {showExplanation && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{currentIndex === questions.length - 1 ? 'Lihat Hasil Akhir' : 'Soal Berikutnya'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Results Screen */
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 mx-auto flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Evaluasi Selesai • Tersimpan di Firestore
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Hasil Kuis Bab {bab.number}: {bab.title}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              {scoreData.percentage >= 80
                ? 'Maa Syaa Allah! Nilai sangat memuaskan (Mumtaz).'
                : scoreData.percentage >= 60
                ? 'Alhamdulillah! Nilai kamu tuntas (Jayyid Jiddan).'
                : 'Terus semangat muraja\'ah dan tingkatkan hafalanmu!'}
            </p>
          </div>

          {/* Score Badge */}
          <div className="inline-flex items-baseline gap-2 bg-slate-50 border border-slate-200 px-8 py-4 rounded-3xl">
            <span className="text-5xl font-black text-emerald-700 tracking-tight">
              {scoreData.percentage}
            </span>
            <span className="text-slate-400 font-bold text-sm">/ 100</span>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-left text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <span className="text-slate-500 block">Jawaban Benar</span>
              <span className="font-bold text-emerald-700 text-sm">
                {scoreData.correctCount} dari {scoreData.total}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Poin XP Didapat</span>
              <span className="font-bold text-amber-600 text-sm flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                +{scoreData.percentage >= 60 ? '50' : '20'} XP
              </span>
            </div>
          </div>

          {saving && (
            <div className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              Menyimpan data per user ke Firestore...
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Ulangi Kuis
            </button>
            <button
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Kembali ke Materi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
