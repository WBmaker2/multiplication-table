import React from 'react';
import { Delete, Check } from 'lucide-react';

export interface KeypadProps {
  onKeyPress: (num: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  disabled: boolean;
}

export const Keypad: React.FC<KeypadProps> = ({
  onKeyPress,
  onDelete,
  onSubmit,
  disabled,
}) => {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-2">
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
        {digits.map((digit) => (
          <button
            key={digit}
            type="button"
            disabled={disabled}
            onClick={() => onKeyPress(digit)}
            className="h-14 sm:h-16 text-2xl sm:text-3xl font-black rounded-2xl bg-sky-100 hover:bg-sky-200 active:scale-95 text-sky-950 border-2 border-sky-300 shadow-sm hover:shadow-md transition-all flex items-center justify-center touch-manipulation disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
          >
            {digit}
          </button>
        ))}

        {/* Delete button */}
        <button
          type="button"
          disabled={disabled}
          onClick={onDelete}
          aria-label="지우기"
          className="h-14 sm:h-16 text-xl sm:text-2xl font-bold rounded-2xl bg-rose-100 hover:bg-rose-200 active:scale-95 text-rose-800 border-2 border-rose-300 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1 touch-manipulation disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
        >
          <Delete className="w-6 h-6" />
          <span>⌫</span>
        </button>

        {/* 0 button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onKeyPress('0')}
          className="h-14 sm:h-16 text-2xl sm:text-3xl font-black rounded-2xl bg-sky-100 hover:bg-sky-200 active:scale-95 text-sky-950 border-2 border-sky-300 shadow-sm hover:shadow-md transition-all flex items-center justify-center touch-manipulation disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
        >
          0
        </button>

        {/* Submit button */}
        <button
          type="button"
          disabled={disabled}
          onClick={onSubmit}
          aria-label="확인"
          className="h-14 sm:h-16 text-xl sm:text-2xl font-black rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white border-2 border-emerald-600 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1 touch-manipulation disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
        >
          <Check className="w-6 h-6 stroke-[3]" />
          <span>확인</span>
        </button>
      </div>
    </div>
  );
};
