import React, { useEffect, useRef } from 'react';

export interface FeedbackOverlayProps {
  status: 'correct' | 'wrong';
  answer: number;
  message: string;
  onNext: () => void;
}

export const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({
  status,
  answer,
  message,
  onNext,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNext]);

  const isCorrect = status === 'correct';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
    >
      <div
        className={`w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 text-center transform transition-all ${
          isCorrect ? 'border-emerald-300' : 'border-rose-300'
        }`}
      >
        {isCorrect ? (
          <>
            <div className="text-6xl sm:text-7xl mb-2 animate-bounce-short">
              ⭐
            </div>
            <h2 className="text-5xl sm:text-6xl font-black text-emerald-600 mb-3 animate-bounce-short">
              🎉 정답!
            </h2>
            <p className="text-lg sm:text-xl font-bold text-slate-700 mb-6">
              참 잘했어요! 별 1개를 획득했어요 ⭐
            </p>
            <button
              ref={buttonRef}
              type="button"
              onClick={onNext}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black text-xl sm:text-2xl shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-emerald-300 border-2 border-emerald-600"
            >
              다음 문제 풀기 ➡️
            </button>
          </>
        ) : (
          <>
            <div className="text-6xl sm:text-7xl mb-2">
              💭
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-rose-600 mb-3">
              {message || `아쉬워요! 정답은 ${answer}이에요.`}
            </h2>
            <p className="text-lg sm:text-xl font-bold text-slate-700 mb-6">
              다시 힘내봐요! 다음엔 꼭 맞힐 수 있어요! 💪
            </p>
            <button
              ref={buttonRef}
              type="button"
              onClick={onNext}
              className="w-full py-4 px-6 rounded-2xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-black text-xl sm:text-2xl shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-rose-300 border-2 border-rose-600"
            >
              다음 문제 도전 ➡️
            </button>
          </>
        )}
      </div>
    </div>
  );
};
