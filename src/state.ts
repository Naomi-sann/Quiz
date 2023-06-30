import { Answer, AnsweredQuestion, Category, Question, QuestionItem } from "./questions";

export interface GameInProgressState {
  gamePageStatus: "not-started" | "started" | "ended";
  category: Category;
  tag: "in_progress";
  questions: QuestionItem[][] | QuestionItem[];
  answeredQuestions: Array<AnsweredQuestion>;
  currentQuestion: Question;
  currentQuestionCounter: number,
  currentAnswer?: Answer;
  nextQuestions: Array<Question>;
}

export interface GameEndState {
  tag: "ended";
  answeredQuestions: Array<AnsweredQuestion>;
}
