import React, { useState } from 'react';
import { BAB_MODULES } from '../data/curriculumData.ts';
import { MufradatItem } from '../types/index.ts';
import { audioService } from '../services/audioService.ts';
import {
  Volume2,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const FlashcardsSection: React.FC = () => {
  const [selectedBabId, setSelectedBabId] = useState<string>('all');
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [memorizedIds, setMemorizedIds] = useState<Set<string>>(new Set());

  // Aggregate flashcard items
  const allCards: { babNumber: number; item: MufradatItem }[] = [];
  BAB_MODULES.forEach((bab) => {
    bab.mufradatList.forEach((m) => {
      allCards.push({ babNumber: bab.number, item: m });
    });
  });

  const filteredCards =
    selectedBabId === 'all'
      ? allCards
      : allCards.filter(
          (c) => c.babNumber === parseInt(selectedBabId.replace('bab-', ''))
        );

  const current = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const toggleMemorized = (id: string) => {
    setMemorizedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setCurrentIndex(Math.floor(Math.random() * filteredCards.length));
  };

  if (!current) return null;

  const isCurrentMemorized = memorizedIds.has(current.item.id);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Header & Bab Selector */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Kartu Hafalan Mufradat
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik kartu untuk membalik terjemahan, dan latih pelafalan dengan audio
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {memorizedIds.size} / {filteredCards.length} Dihafal
            </span>
          </div>
        </div>

        {/* Bab Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => {
              setSelectedBabId('all');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
              selectedBabId === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Bab
          </button>
          {BAB_MODULES.map((bab) => (
            <button
              key={bab.id}
              onClick={() => {
                setSelectedBabId(bab.id);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                selectedBabId === bab.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Bab {bab.number}
            </button>
          ))}
        </div>
      </div>

      {/* Main Flashcard */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full min-h-[320px] bg-white rounded-3xl p-8 border-2 border-emerald-200 shadow-md hover:shadow-xl hover:border-emerald-400 transition-all cursor-pointer relative flex flex-col justify-between select-none"
      >
        {/* Card Top Badges */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
            Bab {current.babNumber} • {current.item.category || 'Mufradat'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                audioService.playArabic(current.item.arabic);
              }}
              className="p-2 rounded-xl bg-emerald-100/70 hover:bg-emerald-200 text-emerald-800 transition-colors cursor-pointer"
              title="Dengar lafal"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <div className="text-slate-400 text-xs flex items-center gap-1">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Klik balik</span>
            </div>
          </div>
        </div>

        {/* Card Center Content */}
        <div className="text-center py-6 my-auto space-y-3">
          {!isFlipped ? (
            /* FRONT: Arabic */
            <div className="space-y-2">
              <div
                className="font-arabic text-4xl sm:text-5xl font-bold text-emerald-950 leading-relaxed"
                dir="rtl"
              >
                {current.item.arabic}
              </div>
              <div className="text-xs text-slate-400 italic">
                (Klik untuk melihat arti bahasa Indonesia)
              </div>
            </div>
          ) : (
            /* BACK: Meaning & Transliteration */
            <div className="space-y-3 animate-fadeIn">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {current.item.meaning}
              </div>
              <div className="text-sm text-emerald-700 font-semibold italic">
                "{current.item.transliteration}"
              </div>
              {current.item.exampleArabic && (
                <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 max-w-md mx-auto">
                  <span className="font-semibold block mb-0.5">Contoh:</span>
                  <span className="font-arabic text-base text-emerald-900 block" dir="rtl">
                    {current.item.exampleArabic}
                  </span>
                  <span className="italic block mt-0.5 text-slate-500">
                    {current.item.exampleMeaning}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card Bottom: Memorized status */}
        <div className="flex items-center justify-between text-xs pt-4 border-t border-slate-100">
          <span className="text-slate-400 font-medium">
            Kartu {currentIndex + 1} dari {filteredCards.length}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleMemorized(current.item.id);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isCurrentMemorized
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isCurrentMemorized ? 'Sudah Dihafal' : 'Tandai Hafal'}</span>
          </button>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handlePrev}
          className="flex-1 py-3 px-4 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Sebelumnya</span>
        </button>

        <button
          onClick={handleShuffle}
          className="p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs cursor-pointer"
          title="Acak kartu"
        >
          <Shuffle className="w-4 h-4" />
        </button>

        <button
          onClick={handleNext}
          className="flex-1 py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Berikutnya</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
