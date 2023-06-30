export type QuestionItem = {
  title: string;
  answer: string;
};

export enum Option {
  A,
  B,
  C,
  D,
}

export type Question = {
  correctOption: Option;
  optionA: QuestionItem;
  optionB: QuestionItem;
  optionC: QuestionItem;
  optionD: QuestionItem;
};

export type Answer = Option;

export type AnsweredQuestion = {
  question: Question;
  answer: Answer;
};

export type Category = "math" | "geography";

export function isAnswerCorrect({
  question,
  answer,
}: AnsweredQuestion): boolean {
  return question.correctOption === answer;
}

export function questionItem(q: Question): QuestionItem {
  if (q.correctOption === Option.A) {
    return q.optionA;
  } else if (q.correctOption === Option.B) {
    return q.optionB;
  } else if (q.correctOption === Option.C) {
    return q.optionC;
  } else {
    return q.optionD;
  }
}

export function showOption(option: Option): string {
  switch (option) {
    case Option.A:
      return "A";
    case Option.B:
      return "B";
    case Option.C:
      return "C";
    case Option.D:
      return "D";
  }
}

type Stat = { countCorrect: number; countTotal: number; score: number };

export function toStat(questions: Array<AnsweredQuestion>): Stat {
  const countTotal = questions.length;
  const countCorrect = questions.filter(isAnswerCorrect).length;
  const score = countCorrect / countTotal;
  return { countTotal, countCorrect, score };
}

export function makeQuestions(numQuestions: number, data: Array<QuestionItem>) {
  const shuffles = shuffle(data);
  return mkQuestionsRec(numQuestions, shuffles, []);
}

function mkQuestionsRec(
  n: number,
  cities: Array<QuestionItem>,
  result: Array<Question>
): Array<Question> {
  if (n === 0 || cities.length < 4) return result;
  const [optionA, optionB, optionC, optionD, ...rest] = cities;
  const question = {
    optionA,
    optionB,
    optionC,
    optionD,
    correctOption: getRandomOption(),
  };

  return mkQuestionsRec(n - 1, rest, [...result, question]);
}

function getRandomOption(): Option {
  return Math.floor(Math.random() * 4);
}

function shuffle<T>(array: Array<T>): Array<T> {
  return array.sort(() => Math.random() - 0.5);
}
