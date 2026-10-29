import React, { useState } from 'react';
import { chatWithDialogCoach, DialogResponse } from '../services/apiService.ts';
import { audioService } from '../services/audioService.ts';
import {
  MessageSquare,
  Send,
  Volume2,
  Sparkles,
  Lightbulb,
  CheckCircle,
  RotateCcw,
  Bot,
  User,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  arabic?: string;
  transliteration?: string;
  translation?: string;
  feedback?: string;
}

export const MuhadatsahAI: React.FC = () => {
  const [scenario, setScenario] = useState('perkenalan_santri');
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedOptions, setSuggestedOptions] = useState<string[]>([
    'السَّلَامُ عَلَيْكُمْ، مَا اسْمُكَ؟',
    'أَهْلًا وَسَهْلًا، أَنَا طَالِبٌ جَدِيدٌ هُنَا',
  ]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'initial',
      sender: 'ai',
      text: 'السَّلَامُ عَلَيْكُمْ يَا أَخِي! أَهْلًا وَسَهْلًا بِكَ فِي مَعْهَدِ دَارِ الْفَقِيهِ الإِسْلَامِيِّ. كَيْفَ حَالُكَ الْيَوْمَ؟',
      arabic: 'السَّلَامُ عَلَيْكُمْ يَا أَخِي! أَهْلًا وَسَهْلًا بِكَ فِي مَعْهَدِ دَارِ الْفَقِيهِ الإِسْلَامِيِّ. كَيْفَ حَالُكَ الْيَوْمَ؟',
      transliteration: "Assalaamu 'alaikum yaa akhii! Ahlan wa sahlan bika fii ma'hadi Daaril Faqiih Al-Islaamiyy. Kayfa haalukal yawm?",
      translation: 'Semoga keselamatan tercurah atasmu wahai saudaraku! Selamat datang di Pesantren MA Darul Faqih. Bagaimana kabarmu hari ini?',
      feedback: 'Lawan bicara menyapa dan menanyakan kabarmu. Kamu bisa menjawab "Alhamdulillah bikhair" atau perkenalkan namamu.',
    },
  ]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res: DialogResponse = await chatWithDialogCoach(textToSend, history, scenario);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: res.arabic || 'نَعَمْ، مُمْتَازٌ!',
        arabic: res.arabic,
        transliteration: res.transliteration,
        translation: res.translation,
        feedback: res.feedback,
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (res.suggestedNextOptions && res.suggestedNextOptions.length > 0) {
        setSuggestedOptions(res.suggestedNextOptions);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'initial',
        sender: 'ai',
        text: 'السَّلَامُ عَلَيْكُمْ يَا أَخِي! أَهْلًا وَسَهْلًا بِكَ فِي مَعْهَدِ دَارِ الْفَقِيهِ الإِسْلَامِيِّ.',
        arabic: 'السَّلَامُ عَلَيْكُمْ يَا أَخِي! أَهْلًا وَسَهْلًا بِكَ فِي مَعْهَدِ دَارِ الْفَقِيهِ الإِسْلَامِيِّ.',
        transliteration: "Assalaamu 'alaikum yaa akhii! Ahlan wa sahlan bika fii ma'hadi Daaril Faqiih.",
        translation: 'Semoga keselamatan tercurah atasmu saudaraku! Selamat datang di Pesantren MA Darul Faqih.',
      },
    ]);
    setSuggestedOptions([
      'وَعَلَيْكُمُ السَّلَامُ، اسْمِي فَارِس',
      'الْحَمْدُ للهِ أَنَا بِخَيْرٍ، شُكْرًا لَكَ',
    ]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-700/60 text-teal-200 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Simulasi Muhadatsah Berbasis AI
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Latihan Percakapan Bahasa Arab
            </h1>
            <p className="text-teal-100/90 text-xs sm:text-sm mt-1 max-w-lg">
              Berlatih dialog bahasa Arab sehari-hari khas santri MA Darul Faqih dengan koreksi instan dan audio.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-teal-100 flex items-center gap-1.5 self-start cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Mulai Ulang
          </button>
        </div>

        {/* Scenario Selector */}
        <div className="mt-6 pt-4 border-t border-teal-700/60 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-teal-200 font-semibold shrink-0">Pilih Tema:</span>
          {[
            { id: 'perkenalan_santri', label: 'Perkenalan Santri Baru' },
            { id: 'di_perpustakaan', label: 'Di Perpustakaan' },
            { id: 'di_kantin', label: 'Di Kantin Madrasah' },
            { id: 'hobi_dan_cita', label: 'Hobi & Cita-cita' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setScenario(item.id);
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all cursor-pointer ${
                scenario === item.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                  : 'bg-teal-900/80 hover:bg-teal-800 text-teal-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 min-h-[420px] flex flex-col justify-between">
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1">
          {messages.map((m) => {
            const isAI = m.sender === 'ai';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${isAI ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                    isAI ? 'bg-emerald-700 text-white' : 'bg-slate-700 text-white'
                  }`}
                >
                  {isAI ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-xl rounded-2xl p-4 border text-xs sm:text-sm space-y-2 ${
                    isAI
                      ? 'bg-emerald-50/80 border-emerald-200/90 rounded-tl-none'
                      : 'bg-slate-100 border-slate-300 rounded-tr-none text-slate-900'
                  }`}
                >
                  {isAI ? (
                    <>
                      {/* Arabic Response with Harakat */}
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className="font-arabic text-xl sm:text-2xl text-emerald-950 font-bold leading-relaxed"
                          dir="rtl"
                        >
                          {m.arabic || m.text}
                        </div>
                        <button
                          onClick={() => audioService.playArabic(m.arabic || m.text)}
                          className="p-1.5 rounded-lg bg-white/80 hover:bg-emerald-200 text-emerald-800 shadow-xs cursor-pointer shrink-0"
                          title="Dengarkan lafal"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Transliteration & Translation */}
                      {m.transliteration && (
                        <div className="text-xs text-slate-500 italic">
                          "{m.transliteration}"
                        </div>
                      )}
                      {m.translation && (
                        <div className="text-xs text-slate-700 font-medium">
                          {m.translation}
                        </div>
                      )}

                      {/* Feedback from AI Coach */}
                      {m.feedback && (
                        <div className="mt-2 pt-2 border-t border-emerald-200/60 text-[11px] text-emerald-900 flex items-start gap-1.5 bg-emerald-100/50 p-2 rounded-lg">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span><b>Catatan Guru:</b> {m.feedback}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div>
                      <span className="font-semibold">{m.text}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-emerald-700 p-2">
              <Sparkles className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Teman bicara sedang membalas dalam Bahasa Arab...</span>
            </div>
          )}
        </div>

        {/* Suggested Response Options */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Pilihan Balasan Cepat:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(opt)}
                disabled={loading}
                className="text-xs text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl font-medium transition-all text-left flex items-center gap-1.5 font-arabic-inline"
              >
                <span>{opt}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="relative pt-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ketik balasanmu dalam bahasa Arab atau Indonesia..."
            className="w-full pr-12 pl-4 py-3 rounded-2xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !inputMessage.trim()}
            className="absolute right-2 top-4 p-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white disabled:opacity-40 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
