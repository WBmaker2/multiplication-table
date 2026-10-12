import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export interface HeaderProps {
  score: number;
  streak: number;
  stars: number;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  streak,
  stars,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="w-full max-w-xl mx-auto px-4 py-3 sm:py-4">
      {/* Title & Sound toggle */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <h1 className="text-2xl sm:text-3xl font-black text-amber-900 tracking-tight flex items-center gap-1.5 drop-shadow-sm select-none">
          신나는 구구단 탐험대 🚀
        </h1>
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={isMuted ? '음소거 해제' : '음소거 토글'}
          className="p-2 sm:p-2.5 rounded-2xl bg-white/80 hover:bg-white text-slate-700 shadow-md hover:shadow-lg transition-all active:scale-95 border-2 border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6 text-rose-500" />
          ) : (
            <Volume2 className="w-6 h-6 text-emerald-600" />
          )}
        </button>
      </div>

      {/* Badges / Counters */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
        <div className="bg-yellow-100/90 border-2 border-yellow-300 rounded-2xl py-2 px-1 shadow-sm flex flex-col items-center justify-center">
          <span className="text-xs sm:text-sm font-bold text-yellow-800 flex items-center gap-1">
            ⭐ 별
          </span>
          <span className="text-xl sm:text-2xl font-black text-yellow-950">
            {stars}
          </span>
        </div>

        <div className="bg-orange-100/90 border-2 border-orange-300 rounded-2xl py-2 px-1 shadow-sm flex flex-col items-center justify-center">
          <span className="text-xs sm:text-sm font-bold text-orange-800 flex items-center gap-1">
            🔥 연속
          </span>
          <span className="text-xl sm:text-2xl font-black text-orange-950">
            {streak}
          </span>
        </div>

        <div className="bg-emerald-100/90 border-2 border-emerald-300 rounded-2xl py-2 px-1 shadow-sm flex flex-col items-center justify-center">
          <span className="text-xs sm:text-sm font-bold text-emerald-800 flex items-center gap-1">
            🏆 맞힌 문제
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-950">
            {score}
          </span>
        </div>
      </div>
    </header>
  );
};
