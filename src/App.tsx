import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { QuizCard } from './components/QuizCard';
import { Keypad } from './components/Keypad';
import { FeedbackOverlay } from './components/FeedbackOverlay';
import {
  Question,
  generateQuestion,
  checkAnswer,
} from './utils/gameLogic';
import {
  getMuted,
  toggleMute,
  playClickSound,
  playCorrectSound,
  playWrongSound,
} from './utils/soundEffects';

export interface FeedbackState {
  status: 'correct' | 'wrong';
  answer: number;
  message: string;
}

export const App: React.FC = () => {
  const [question, setQuestion] = useState<Question>(() => generateQuestion());
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(() => getMuted());
  const [isShaking, setIsShaking] = useState<boolean>(false);

  const shakeTimeoutRef = useRef<NodeJS.Timeout | number | null>(null);

  useEffect(() => {
    return () => {
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current);
      }
    };
  }, []);

  const triggerShake = () => {
    setIsShaking(true);
    playClickSound();
    if (shakeTimeoutRef.current) {
      clearTimeout(shakeTimeoutRef.current);
    }
    shakeTimeoutRef.current = setTimeout(() => {
      setIsShaking(false);
    }, 500);
  };

  const handleKeyPress = (digit: string) => {
    if (feedback !== null) return;
    setUserAnswer((prev) => {
      if (prev.length >= 2) return prev;
      return prev + digit;
    });
    playClickSound();
  };

  const handleDelete = () => {
    if (feedback !== null) return;
    setUserAnswer((prev) => prev.slice(0, -1));
    playClickSound();
  };

  const handleChangeAnswer = (val: string) => {
    if (feedback !== null) return;
    const sanitized = val.replace(/[^0-9]/g, '').slice(0, 2);
    setUserAnswer(sanitized);
  };

  const handleSubmit = () => {
    if (feedback !== null) return;
    if (userAnswer.trim() === '') {
      triggerShake();
      return;
    }

    const result = checkAnswer(question, userAnswer);
    if (result.isCorrect) {
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
      setStars((st) => st + 1);
      playCorrectSound();
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {
        // Safe fallback in environments without canvas support
      }
      setFeedback({
        status: 'correct',
        answer: question.answer,
        message: '정답',
      });
    } else {
      setStreak(0);
      playWrongSound();
      setFeedback({
        status: 'wrong',
        answer: question.answer,
        message: result.message,
      });
    }
  };

  const handleNextQuestion = () => {
    setQuestion((prev) => generateQuestion(prev));
    setUserAnswer('');
    setFeedback(null);
    playClickSound();
  };

  const handleToggleMute = () => {
    const next = toggleMute();
    setIsMuted(next);
  };

  // Keyboard navigation & shortcut support
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (feedback !== null) return;

      const isInput = (e.target as HTMLElement)?.tagName === 'INPUT';

      if (e.key === 'Enter') {
        if (userAnswer.trim() === '') {
          triggerShake();
        } else if (!isInput) {
          handleSubmit();
        }
        return;
      }

      if (!isInput) {
        if (/^[0-9]$/.test(e.key)) {
          e.preventDefault();
          handleKeyPress(e.key);
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
          e.preventDefault();
          handleDelete();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [feedback, userAnswer, question]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex flex-col justify-between p-3 sm:p-4 text-slate-800">
      <Header
        score={score}
        streak={streak}
        stars={stars}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto py-2 sm:py-4 gap-4">
        <QuizCard
          question={question}
          userAnswer={userAnswer}
          onChangeAnswer={handleChangeAnswer}
          onSubmit={handleSubmit}
          isShaking={isShaking}
          disabled={feedback !== null}
        />

        <Keypad
          onKeyPress={handleKeyPress}
          onDelete={handleDelete}
          onSubmit={handleSubmit}
          disabled={feedback !== null}
        />
      </main>

      <footer className="py-2 sm:py-3 text-center text-amber-900/80 font-bold text-sm sm:text-base select-none">
        매일매일 즐거운 구구단 놀이! 🌟
      </footer>

      {feedback && (
        <FeedbackOverlay
          status={feedback.status}
          answer={feedback.answer}
          message={feedback.message}
          onNext={handleNextQuestion}
        />
      )}
    </div>
  );
};

export default App;
