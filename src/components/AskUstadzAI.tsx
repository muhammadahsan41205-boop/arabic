import React, { useState } from 'react';
import { askUstadzAI } from '../services/apiService.ts';
import { audioService } from '../services/audioService.ts';
import {
  Sparkles,
  Send,
  HelpCircle,
  Volume2,
  Copy,
  Check,
  BookOpen,
  MessageCircleQuestion,
  Lightbulb,
} from 'lucide-react';

export const AskUstadzAI: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<
    { id: string; q: string; a: string; timestamp: string }[]
  >([
    {
      id: 'welcome',
      q: 'Assalamu\'alaikum Ustadz, apa tips mudah mengingat pembagian kata (Kalam) dalam bahasa Arab?',
      a: `Wa'alaikumussalaam warahmatullah wabarakaatuh. Ahlan wa sahlan!

Berikut tips mudah memahami pembagian kata (أَقْسَامُ الْكَلَامِ) untuk santri Kelas X MA Darul Faqih:

1. الِاسْمُ (Isim - Kata Benda/Sifat):
• Tandanya: Ada Alif Lam (الْكِتَابُ), bertanwin (طَالِبٌ), atau didahului huruf jar (فِي الْمَسْجِدِ).
• Makna: Menunjukkan nama orang, benda, atau sifat tanpa terikat waktu.

2. الْفِعْلُ (Fi'il - Kata Kerja):
• Tandanya: Menerima huruf Qad (قَدْ), Sin (سَـ), Saufa (سَوْفَ), atau Ta Ta'nits Sakinah (قَالَتْ).
• Makna: Menunjukkan pekerjaan yang terikat masa lampau (Madhi), sekarang/nanti (Mudhari'), atau perintah (Amar).

3. الْحَرْفُ (Huruf - Kata Tugas/Depan):
• Contoh: فِي (di dalam), إِلَى (ke), عَلَى (di atas), مِنْ (dari).
• Cirinya: Tidak menerima tanda isim maupun tanda fi'il, dan maknanya baru jelas saat bersambung dengan kalimat lain.

Semoga Allah memudahkan belajarmu di MA Darul Faqih!`,
      timestamp: 'Baru saja',
    },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const samplePrompts = [
    'Apa perbedaan mendasar antara Mubtada\' dan Khobar?',
    'Bagaimana rumus Jumlah Fi\'liyyah (Fi\'il + Fa\'il + Maf\'ul)?',
    'Tolong buatkan 3 contoh kalimat tentang kegiatan di asrama santri.',
    'Jelaskan kaidah Dhomir Munfashil untuk mufrad (tunggal)!',
    'Bagaimana cara membedakan kata Mudzakkar dan Muannats?',
  ];

  const handleSubmit = async (qText?: string) => {
    const query = qText || question;
    if (!query.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const answer = await askUstadzAI(query, 'Kurikulum Bahasa Arab Kelas X MA Darul Faqih Indonesia');
      setHistory((prev) => [
        {
          id: Date.now().toString(),
          q: query,
          a: answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev,
      ]);
      setQuestion('');
    } catch (err: any) {
      setError(err.message || 'Gagal memproses pertanyaan. Pastikan server AI aktif.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Asisten AI Berbasis Gemini 3.8 Flash
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Tanya Ustadz Asisten Bahasa Arab
          </h1>
          <p className="text-emerald-100/90 text-xs sm:text-sm max-w-xl leading-relaxed">
            Ajukan pertanyaan seputar kaidah Nahwu, Shorof, terjemah kalimat, wazan fi'il, maupun kosakata bahasa Arab kelas X MA Darul Faqih.
          </p>
        </div>
      </div>

      {/* Input Box */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
            <MessageCircleQuestion className="w-4 h-4 text-emerald-600" />
            Ketik Pertanyaan atau Materi yang Ingin Dipelajari:
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Contoh: Ustadz, apa itu Isim Isyarah dan bagaimana contoh penggunaannya untuk benda muannats?"
              className="w-full p-4 rounded-2xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
            />
            <button
              onClick={() => handleSubmit()}
              disabled={loading || !question.trim()}
              className="absolute right-3 bottom-3 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
            >
              {loading ? (
                <span>Menjawab...</span>
              ) : (
                <>
                  <span>Kirim</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs">
            {error}
          </div>
        )}

        {/* Quick Sample Prompts */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-500" />
            Contoh Pertanyaan Cepat:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuestion(p);
                  handleSubmit(p);
                }}
                disabled={loading}
                className="text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-2.5 py-1 rounded-lg transition-colors text-left"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Q&A Thread History */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Riwayat Tanya Jawab:
        </h2>

        {history.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4"
          >
            {/* Student's Question */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                S
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-500">Pertanyaan Santri:</div>
                <div className="text-sm font-semibold text-slate-800 mt-0.5">
                  {item.q}
                </div>
              </div>
            </div>

            {/* AI Teacher's Answer */}
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200/50">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                    U
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-900 block">
                      Ustadz Asisten Bahasa Arab
                    </span>
                    <span className="text-[10px] text-slate-400">
                      MA Darul Faqih • {item.timestamp}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(item.id, item.a)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-white text-xs flex items-center gap-1 cursor-pointer"
                    title="Salin penjelasan"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Formatted Text */}
              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-normal">
                {item.a}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
