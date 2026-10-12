import { describe, it, expect } from 'vitest';
import { generateQuestion, checkAnswer, Question } from '../src/utils/gameLogic';

describe('gameLogic', () => {
  it('generates a question within 2~9 dan and 1~9 multiplier', () => {
    for (let i = 0; i < 100; i++) {
      const q = generateQuestion();
      expect(q.num1).toBeGreaterThanOrEqual(2);
      expect(q.num1).toBeLessThanOrEqual(9);
      expect(q.num2).toBeGreaterThanOrEqual(1);
      expect(q.num2).toBeLessThanOrEqual(9);
      expect(q.answer).toBe(q.num1 * q.num2);
    }
  });

  it('avoids immediately repeating the exact same question', () => {
    const prev: Question = { num1: 3, num2: 4, answer: 12 };
    for (let i = 0; i < 50; i++) {
      const q = generateQuestion(prev);
      expect(q.num1 === prev.num1 && q.num2 === prev.num2).toBe(false);
    }
  });

  it('correctly grades right answer', () => {
    const q: Question = { num1: 7, num2: 8, answer: 56 };
    const res = checkAnswer(q, '56');
    expect(res.isCorrect).toBe(true);
    expect(res.answer).toBe(56);
    expect(res.message).toBe('정답');
  });

  it('correctly grades wrong answer with required message format', () => {
    const q: Question = { num1: 6, num2: 4, answer: 24 };
    const res = checkAnswer(q, '20');
    expect(res.isCorrect).toBe(false);
    expect(res.answer).toBe(24);
    expect(res.message).toBe('아쉬워요! 정답은 24이에요.');
  });
});
