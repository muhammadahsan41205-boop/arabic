import React, { useState } from 'react';
import { checkGrammar, GrammarAnalysis } from '../services/apiService.ts';
import { audioService } from '../services/audioService.ts';
import {
  CheckCircle2,
  Sparkles,
  Volume2,
  HelpCircle,
  Lightbulb,
  FileCheck,
} from 'lucide-react';

export const GrammarCheckerAI: React.FC = () => {
  const [inputText, setInputText] = useState('ذهب الطالب الى المدرسة');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GrammarAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const data = await checkGrammar(inputText);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Gagal menganalisis kaidah kalimat.');
    } finally {
      setLoading(false);
    }
  };

  const sampleSentences = [
    'ذهب الطالب الى المدرسة',
    'المسجد امام سكن الطلاب',
    'قرا زيد كتاب النحو',
    'فاطمة طالبة ماهرة',
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold mb-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
          Koreksi & Bedah Kaidah Nahwu
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Bedah Harakat & Analisis I'rab Kalimat
        </h1>
        <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 max-w-xl">
          Ketik kalimat Arab (dengan atau tanpa harakat) untuk dibedah susunan tata bahasa, kedudukan kata, dan pelafalan yang benar.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Masukkan Kalimat Bahasa Arab:
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-4 rounded-2xl border border-slate-300 text-base font-arabic text-right focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="اكتب الجملة هنا..."
              dir="rtl"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs text-slate-500">
            <span className="font-semibold shrink-0">Contoh:</span>
            {sampleSentences.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputText(s)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-emerald-800 font-arabic-inline whitespace-nowrap"
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !inputText.trim()}
            className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{loading ? 'Menganalisis...' : 'Bedah Kalimat'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Result */}
      {result && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              Hasil Koreksi & Analisis Kaidah
            </h2>
            <button
              onClick={() => audioService.playArabic(result.correctedArabic)}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              Dengar Lafal Benar
            </button>
          </div>

          {/* Corrected Arabic Display */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Kalimat dengan Harakat Sempurna:
            </span>
            <div
              className="font-arabic text-3xl sm:text-4xl font-bold text-emerald-950 leading-relaxed"
              dir="rtl"
            >
              {result.correctedArabic}
            </div>
            <div className="text-xs text-slate-500 italic mt-1">
              "{result.transliteration}"
            </div>
            <div className="text-sm font-semibold text-slate-800">
              Arti: {result.translation}
            </div>
          </div>

          {/* I'rab Breakdown Table */}
          {result.irabHighlights && result.irabHighlights.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Tabel Rincian Kedudukan Kata (I'rab):
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700 font-bold">
                    <tr>
                      <th className="p-3">Kata (الْكَلِمَةُ)</th>
                      <th className="p-3">Kedudukan</th>
                      <th className="p-3">Tanda Harakat</th>
                      <th className="p-3">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {result.irabHighlights.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-arabic text-xl font-bold text-emerald-900" dir="rtl">
                          {row.word}
                        </td>
                        <td className="p-3 font-semibold text-slate-800">
                          {row.role}
                        </td>
                        <td className="p-3 text-slate-600">
                          {row.harakat}
                        </td>
                        <td className="p-3 text-slate-600">
                          {row.explanation}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Teacher's Notes */}
          {result.teacherNotes && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Nasihat Ustadz: </span>
                <span>{result.teacherNotes}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
