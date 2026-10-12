import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../src/components/Header';
import { QuizCard } from '../src/components/QuizCard';
import { Keypad } from '../src/components/Keypad';
import { FeedbackOverlay } from '../src/components/FeedbackOverlay';

describe('UI Components', () => {
  describe('QuizCard', () => {
    it('renders QuizCard formula properly', () => {
      const question = { num1: 4, num2: 7, answer: 28 };
      render(
        <QuizCard
          question={question}
          userAnswer=""
          onChangeAnswer={() => {}}
          onSubmit={() => {}}
          isShaking={false}
          disabled={false}
        />
      );
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('×')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument();
    });

    it('handles answer input change and submit', () => {
      const handleChange = vi.fn();
      const handleSubmit = vi.fn();
      const question = { num1: 6, num2: 8, answer: 48 };

      render(
        <QuizCard
          question={question}
          userAnswer="4"
          onChangeAnswer={handleChange}
          onSubmit={handleSubmit}
          isShaking={false}
          disabled={false}
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('4');

      fireEvent.change(input, { target: { value: '48' } });
      expect(handleChange).toHaveBeenCalledWith('48');

      const submitButton = screen.getByRole('button', { name: /확인/i });
      fireEvent.click(submitButton);
      expect(handleSubmit).toHaveBeenCalled();

      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      expect(handleSubmit).toHaveBeenCalledTimes(2);
    });

    it('applies shaking animation class when isShaking is true', () => {
      const question = { num1: 3, num2: 3, answer: 9 };
      const { container } = render(
        <QuizCard
          question={question}
          userAnswer="5"
          onChangeAnswer={() => {}}
          onSubmit={() => {}}
          isShaking={true}
          disabled={false}
        />
      );
      const card = container.firstChild as HTMLElement;
      expect(card.className).toMatch(/wiggle|shake/);
    });

    it('disables input and submit button when disabled is true', () => {
      const question = { num1: 2, num2: 2, answer: 4 };
      render(
        <QuizCard
          question={question}
          userAnswer="4"
          onChangeAnswer={() => {}}
          onSubmit={() => {}}
          isShaking={false}
          disabled={true}
        />
      );
      const input = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /확인/i });
      expect(input).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });

  describe('FeedbackOverlay', () => {
    it('renders Correct feedback overlay with big 정답', () => {
      render(
        <FeedbackOverlay
          status="correct"
          answer={28}
          message="정답"
          onNext={() => {}}
        />
      );
      expect(screen.getByText(/정답/)).toBeInTheDocument();
      expect(screen.getByText(/참 잘했어요/)).toBeInTheDocument();
      expect(screen.getByText(/다음 문제 풀기/)).toBeInTheDocument();
    });

    it('renders Wrong feedback with required message', () => {
      render(
        <FeedbackOverlay
          status="wrong"
          answer={28}
          message="아쉬워요! 정답은 28이에요."
          onNext={() => {}}
        />
      );
      expect(screen.getByText('아쉬워요! 정답은 28이에요.')).toBeInTheDocument();
      expect(screen.getByText(/다시 힘내봐요/)).toBeInTheDocument();
      expect(screen.getByText(/다음 문제 도전/)).toBeInTheDocument();
    });

    it('triggers onNext on button click and Enter key press', () => {
      const handleNext = vi.fn();
      render(
        <FeedbackOverlay
          status="correct"
          answer={12}
          message="정답"
          onNext={handleNext}
        />
      );

      const nextButton = screen.getByRole('button', { name: /다음 문제/i });
      fireEvent.click(nextButton);
      expect(handleNext).toHaveBeenCalledTimes(1);

      fireEvent.keyDown(window, { key: 'Enter', code: 'Enter' });
      expect(handleNext).toHaveBeenCalledTimes(2);
    });
  });

  describe('Keypad', () => {
    it('renders 0-9 digits, delete and submit buttons, calling callbacks', () => {
      const handleKeyPress = vi.fn();
      const handleDelete = vi.fn();
      const handleSubmit = vi.fn();

      render(
        <Keypad
          onKeyPress={handleKeyPress}
          onDelete={handleDelete}
          onSubmit={handleSubmit}
          disabled={false}
        />
      );

      for (let i = 0; i <= 9; i++) {
        const btn = screen.getByRole('button', { name: String(i) });
        fireEvent.click(btn);
        expect(handleKeyPress).toHaveBeenCalledWith(String(i));
      }

      const deleteBtn = screen.getByRole('button', { name: /지우기|⌫|delete/i });
      fireEvent.click(deleteBtn);
      expect(handleDelete).toHaveBeenCalledTimes(1);

      const submitBtn = screen.getByRole('button', { name: /확인/i });
      fireEvent.click(submitBtn);
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it('disables all buttons when disabled prop is true', () => {
      render(
        <Keypad
          onKeyPress={() => {}}
          onDelete={() => {}}
          onSubmit={() => {}}
          disabled={true}
        />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach((btn) => {
        expect(btn).toBeDisabled();
      });
    });
  });

  describe('Header', () => {
    it('renders title, stats badges, and sound mute button', () => {
      const handleToggleMute = vi.fn();
      const { rerender } = render(
        <Header
          score={5}
          streak={3}
          stars={2}
          isMuted={false}
          onToggleMute={handleToggleMute}
        />
      );

      expect(screen.getByText('신나는 구구단 탐험대 🚀')).toBeInTheDocument();
      expect(screen.getByText(/5/)).toBeInTheDocument();
      expect(screen.getByText(/3/)).toBeInTheDocument();
      expect(screen.getByText(/2/)).toBeInTheDocument();

      const soundBtn = screen.getByRole('button', { name: /소리|음소거/i });
      fireEvent.click(soundBtn);
      expect(handleToggleMute).toHaveBeenCalledTimes(1);

      rerender(
        <Header
          score={5}
          streak={3}
          stars={2}
          isMuted={true}
          onToggleMute={handleToggleMute}
        />
      );
      expect(screen.getByRole('button', { name: /소리|음소거/i })).toBeInTheDocument();
    });
  });
});
