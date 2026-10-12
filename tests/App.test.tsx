import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App';
import * as soundEffects from '../src/utils/soundEffects';
import * as gameLogic from '../src/utils/gameLogic';
import confetti from 'canvas-confetti';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('App Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    soundEffects.setMuted(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders title, score badges, question card, keypad, and footer note', () => {
    render(<App />);

    expect(screen.getByText('신나는 구구단 탐험대 🚀')).toBeInTheDocument();
    expect(screen.getByText('⭐ 별')).toBeInTheDocument();
    expect(screen.getByText('🔥 연속')).toBeInTheDocument();
    expect(screen.getByText('🏆 맞힌 문제')).toBeInTheDocument();

    const initialZeros = screen.getAllByText('0');
    expect(initialZeros.length).toBeGreaterThanOrEqual(3);

    expect(screen.getByText('×')).toBeInTheDocument();
    expect(screen.getByText('=')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /정답 입력/i })).toBeInTheDocument();

    for (let i = 0; i <= 9; i++) {
      expect(screen.getByRole('button', { name: String(i) })).toBeInTheDocument();
    }
    expect(screen.getByRole('button', { name: /지우기/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /음소거/i })).toBeInTheDocument();
    expect(screen.getByText('매일매일 즐거운 구구단 놀이! 🌟')).toBeInTheDocument();
  });

  it('updates answer input using keypad buttons and delete button', () => {
    render(<App />);
    const input = screen.getByRole('textbox', { name: /정답 입력/i });

    fireEvent.click(screen.getByRole('button', { name: '3' }));
    expect(input).toHaveValue('3');

    fireEvent.click(screen.getByRole('button', { name: '5' }));
    expect(input).toHaveValue('35');

    // 2-digit limit check
    fireEvent.click(screen.getByRole('button', { name: '8' }));
    expect(input).toHaveValue('35');

    // Delete single digit
    fireEvent.click(screen.getByRole('button', { name: /지우기/i }));
    expect(input).toHaveValue('3');

    // Delete second digit
    fireEvent.click(screen.getByRole('button', { name: /지우기/i }));
    expect(input).toHaveValue('');
  });

  it('shows shaking animation and does not submit when trying to submit empty input via keypad button or Enter key', () => {
    render(<App />);
    const submitBtns = screen.getAllByRole('button', { name: '확인' });
    const keypadSubmit = submitBtns[submitBtns.length - 1];

    fireEvent.click(keypadSubmit);

    // Feedback overlay should not appear
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // QuizCard should have shaking class
    const card = screen.getByRole('textbox', { name: /정답 입력/i }).closest('div[class*="rounded-3xl"]');
    expect(card?.className).toMatch(/wiggle|shake/);

    // Also test Enter key when empty
    fireEvent.keyDown(window, { key: 'Enter', code: 'Enter' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(card?.className).toMatch(/wiggle|shake/);
  });

  it('handles physical keyboard typing and backspace via window events when input is not focused', () => {
    render(<App />);
    const input = screen.getByRole('textbox', { name: /정답 입력/i });
    input.blur();

    fireEvent.keyDown(window, { key: '7' });
    expect(input).toHaveValue('7');

    fireEvent.keyDown(window, { key: '8' });
    expect(input).toHaveValue('78');

    fireEvent.keyDown(window, { key: '9' }); // 2-digit max
    expect(input).toHaveValue('78');

    fireEvent.keyDown(window, { key: 'Backspace' });
    expect(input).toHaveValue('7');
  });

  it('handles correct answer submission, shows celebration, and advances to next question', () => {
    const mockQuestions = [
      { num1: 3, num2: 4, answer: 12 },
      { num1: 5, num2: 6, answer: 30 },
      { num1: 7, num2: 8, answer: 56 },
    ];
    let questionIdx = 0;
    vi.spyOn(gameLogic, 'generateQuestion').mockImplementation(() => {
      const q = mockQuestions[questionIdx] || { num1: 2, num2: 2, answer: 4 };
      questionIdx++;
      return q;
    });

    render(<App />);

    expect(screen.getAllByText('3').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('4').length).toBeGreaterThanOrEqual(2);

    // Type 12 using keypad
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));

    const submitBtns = screen.getAllByRole('button', { name: '확인' });
    fireEvent.click(submitBtns[submitBtns.length - 1]);

    // Feedback overlay with celebration
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/정답/)).toBeInTheDocument();
    expect(screen.getByText(/참 잘했어요/)).toBeInTheDocument();
    expect(confetti).toHaveBeenCalledWith(expect.objectContaining({ particleCount: 70 }));

    // Counters incremented
    expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(3);

    // Advance to next question
    const nextBtn = screen.getByRole('button', { name: /다음 문제 풀기/i });
    fireEvent.click(nextBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getAllByText('5').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('6').length).toBeGreaterThanOrEqual(2);
    const input = screen.getByRole('textbox', { name: /정답 입력/i });
    expect(input).toHaveValue('');
  });

  it('handles submission using QuizCard submit button when answer is entered', () => {
    vi.spyOn(gameLogic, 'generateQuestion').mockReturnValue({ num1: 2, num2: 5, answer: 10 });
    render(<App />);

    const input = screen.getByRole('textbox', { name: /정답 입력/i });
    fireEvent.change(input, { target: { value: '10' } });

    // The first '확인' button is on QuizCard
    const cardSubmitBtn = screen.getAllByRole('button', { name: '확인' })[0];
    fireEvent.click(cardSubmitBtn);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/정답/)).toBeInTheDocument();
  });

  it('handles wrong answer submission, resets streak, and preserves score/stars', () => {
    const mockQuestions = [
      { num1: 2, num2: 3, answer: 6 },
      { num1: 7, num2: 8, answer: 56 },
      { num1: 9, num2: 9, answer: 81 },
    ];
    let questionIdx = 0;
    vi.spyOn(gameLogic, 'generateQuestion').mockImplementation(() => {
      const q = mockQuestions[questionIdx] || { num1: 2, num2: 2, answer: 4 };
      questionIdx++;
      return q;
    });

    render(<App />);

    // 1st question: answer correctly
    fireEvent.click(screen.getByRole('button', { name: '6' }));
    const submitBtns1 = screen.getAllByRole('button', { name: '확인' });
    fireEvent.click(submitBtns1[submitBtns1.length - 1]);
    fireEvent.click(screen.getByRole('button', { name: /다음 문제 풀기/i }));

    // Streak is 1, Score is 1, Stars is 1
    // 2nd question: enter wrong answer 99
    fireEvent.click(screen.getByRole('button', { name: '9' }));
    fireEvent.click(screen.getByRole('button', { name: '9' }));
    const submitBtns2 = screen.getAllByRole('button', { name: '확인' });
    fireEvent.click(submitBtns2[submitBtns2.length - 1]);

    // Feedback overlay with wrong answer notice
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('아쉬워요! 정답은 56이에요.')).toBeInTheDocument();

    // Dismiss overlay
    fireEvent.click(screen.getByRole('button', { name: /다음 문제 도전/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Streak should be reset to 0, while score and stars stay 1
    expect(screen.getByText('🔥 연속').parentElement).toHaveTextContent('0');
    expect(screen.getByText('⭐ 별').parentElement).toHaveTextContent('1');
    expect(screen.getByText('🏆 맞힌 문제').parentElement).toHaveTextContent('1');
  });

  it('toggles sound mute state when sound button is clicked', () => {
    render(<App />);
    const soundBtn = screen.getByRole('button', { name: /음소거 토글/i });

    fireEvent.click(soundBtn);
    expect(screen.getByRole('button', { name: /음소거 해제/i })).toBeInTheDocument();
    expect(soundEffects.getMuted()).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: /음소거 해제/i }));
    expect(screen.getByRole('button', { name: /음소거 토글/i })).toBeInTheDocument();
    expect(soundEffects.getMuted()).toBe(false);
  });

  it('handles physical Enter key for submission and advancing next question', () => {
    const mockQuestions = [
      { num1: 4, num2: 4, answer: 16 },
      { num1: 9, num2: 9, answer: 81 },
      { num1: 3, num2: 3, answer: 9 },
    ];
    let questionIdx = 0;
    vi.spyOn(gameLogic, 'generateQuestion').mockImplementation(() => {
      const q = mockQuestions[questionIdx] || { num1: 2, num2: 2, answer: 4 };
      questionIdx++;
      return q;
    });

    render(<App />);
    const input = screen.getByRole('textbox', { name: /정답 입력/i });

    fireEvent.change(input, { target: { value: '16' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/정답/)).toBeInTheDocument();

    // Press Enter while overlay is open to advance
    fireEvent.keyDown(window, { key: 'Enter', code: 'Enter' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getAllByText('9').length).toBeGreaterThanOrEqual(2);
  });

  it('handles confetti error gracefully without failing submission', () => {
    vi.mocked(confetti).mockImplementationOnce(() => {
      throw new Error('Canvas not supported');
    });
    vi.spyOn(gameLogic, 'generateQuestion').mockReturnValue({ num1: 2, num2: 2, answer: 4 });

    render(<App />);
    const input = screen.getByRole('textbox', { name: /정답 입력/i });
    fireEvent.change(input, { target: { value: '4' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/정답/)).toBeInTheDocument();
  });
});
