export interface Question {
  num1: number; // 2 ~ 9
  num2: number; // 1 ~ 9
  answer: number;
}

export function generateQuestion(prev?: Question): Question {
  let num1: number;
  let num2: number;

  do {
    // 2단부터 9단까지
    num1 = Math.floor(Math.random() * 8) + 2;
    // 1부터 9까지
    num2 = Math.floor(Math.random() * 9) + 1;
  } while (prev && prev.num1 === num1 && prev.num2 === num2);

  return {
    num1,
    num2,
    answer: num1 * num2,
  };
}

export interface CheckResult {
  isCorrect: boolean;
  answer: number;
  message: string;
}

export function checkAnswer(question: Question, inputStr: string): CheckResult {
  const trimmed = inputStr.trim();
  const numericInput = parseInt(trimmed, 10);
  const isCorrect = numericInput === question.answer;

  return {
    isCorrect,
    answer: question.answer,
    message: isCorrect
      ? '정답'
      : `아쉬워요! 정답은 ${question.answer}이에요.`,
  };
}
