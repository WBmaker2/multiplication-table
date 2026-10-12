import React, { useRef, useEffect } from 'react';
import { Question } from '../utils/gameLogic';

export interface QuizCardProps {
  question: Question;
  userAnswer: string;
  onChangeAnswer: (val: string) => void;
  onSubmit: () => void;
  isShaking: boolean;
  disabled: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  userAnswer,
  onChangeAnswer,
  onSubmit,
  isShaking,
  disabled,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled, question]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
    onChangeAnswer(sanitized);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div
      className={`w-full max-w-xl mx-auto bg-white/95 rounded-3xl border-4 border-amber-300 shadow-xl p-6 sm:p-8 flex flex-col items-center justify-center transition-all ${
        isShaking ? 'animate-wiggle border-rose-400 ring-4 ring-rose-200' : ''
      }`}
    >
      {/* Formula area */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap my-4 text-slate-800 select-none">
        <span className="text-5xl sm:text-6xl md:text-7xl font-black text-indigo-900 drop-shadow-sm">
          {question.num1}
        </span>
        <span className="text-4xl sm:text-5xl md:text-6xl font-black text-amber-500">
          ×
        </span>
        <span className="text-5xl sm:text-6xl md:text-7xl font-black text-indigo-900 drop-shadow-sm">
          {question.num2}
        </span>
        <span className="text-4xl sm:text-5xl md:text-6xl font-black text-amber-500">
          =
        </span>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={2}
          value={userAnswer}
          disabled={disabled}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoFocus
          aria-label="정답 입력"
          placeholder="?"
          className="w-24 sm:w-28 md:w-32 h-16 sm:h-20 text-4xl sm:text-5xl md:text-6xl font-black text-center text-indigo-950 bg-amber-50 border-4 border-amber-400 rounded-2xl shadow-inner focus:outline-none focus:ring-4 focus:ring-amber-300 focus:border-amber-500 disabled:opacity-50 disabled:bg-slate-100 placeholder:text-amber-300 transition-colors"
        />
      </div>

      {/* Submit button on card */}
      <div className="mt-4 w-full flex justify-center">
        <button
          type="button"
          disabled={disabled || userAnswer.trim() === ''}
          onClick={onSubmit}
          className="w-full max-w-xs py-3.5 sm:py-4 px-6 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-amber-950 font-black text-xl sm:text-2xl shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none border-2 border-amber-500"
        >
          확인
        </button>
      </div>
    </div>
  );
};
