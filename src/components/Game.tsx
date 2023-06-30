import { useReducer } from "react";
import {
  Question,
  Category,
  Answer,
  makeQuestions,
  QuestionItem,
  isAnswerCorrect,
  AnsweredQuestion,
} from "../questions";
import { GameInProgressState } from "../state";
import { GameStart } from "./GameStart";
import { GameInProgress } from "./GameInProgress";
import { GameEnd } from "./GameEnd";
import confetti from "canvas-confetti";

async function fetchQuestions(
  category: string,
  abort_controller_signal?: AbortController["signal"]
) {
  try {
    const requestOptions: RequestInit = {
      method: "GET",
      mode: "cors",
      headers: { Authorization: "", "Content-Type": "application/json" },
      signal: abort_controller_signal,
    };
    const baseURL = "http://localhost:9000/questions/";
    const response = await fetch(baseURL + category, requestOptions);
    return await response.json();
  } catch (error) {
    throw new Error(error as string);
  }
}

type PromiseAction = () => Promise<void>;

type AsyncActionType = {
  setAction(action: PromiseAction[]): void;
  getActions(): PromiseAction[];
  performTask(callTask: Function): void;
  runActions(): void;
};

function AsyncAction(): AsyncActionType {
  let actions: PromiseAction[] = [];

  return {
    setAction(action) {
      actions = action;
    },
    getActions() {
      return actions;
    },
    performTask(callTask) {
      try {
        callTask();
      } catch (err) {
        throw new Error(err as string);
      }
    },
    async runActions() {
      const actionsCopy = [...actions];

      for (let i = 0; i < actions.length; i++) {
        await actions[i]();
        actionsCopy.splice(0, 1);
      }

      actions = actionsCopy;
    },
  };
}

const asyncAction = AsyncAction();

const initialState: GameInProgressState = {
  gamePageStatus: "not-started",
  tag: "in_progress",
  category: "geography",
  answeredQuestions: [],
  questions: [],
  currentQuestion: {
    correctOption: 0,
    optionA: {
      title: "Iran",
      answer: "Tehran",
    },
    optionB: {
      title: "Austria",
      answer: "Wien",
    },
    optionC: {
      title: "Azerbaijan",
      answer: "Baku",
    },
    optionD: {
      title: "Bahamas",
      answer: "Nassau",
    },
  },
  currentQuestionCounter: 0,
  currentAnswer: undefined,
  nextQuestions: [],
};

enum ActionType {
  SetCategory = "SET_CATEGORY",
  SetQuestions = "SET_QUESTIONS",
  StartGame = "START_GAME",
  AnswerQuestion = "ANSWER_QUESTION",
  CheckAnswer = "CHECK_ANSWER",
  RestartGame = "RESTART_GAME",
}

type Action = {
  type: ActionType;
  payload?: unknown;
};

type Reducer = (
  state: GameInProgressState,
  action: Action
) => GameInProgressState;

function getQuestions(questionsLength: number = 6) {
  let questionsCreated = false;
  let questions: Question[] = [];

  const isQuestionsCreated = () => questionsCreated;
  const setIsCreated = (value: boolean) => {
    if (value !== undefined) questionsCreated = value;
    else {
      questionsCreated = !questionsCreated;
    }
  };
  const createQuestion = (data: QuestionItem[]) => {
    if (!questionsCreated) {
      questionsCreated = true;
      questions = makeQuestions(questionsLength, data);
      return questions;
    }

    return questions;
  };
  const getQuestion = (): readonly Question[] => questions;

  return { getQuestion, setIsCreated, isQuestionsCreated, createQuestion };
}

const questionHolder = getQuestions(6);

const reducer: Reducer = (state, action) => {
  switch (action.type) {
    case ActionType.SetCategory: {
      return {
        ...state,
        category: action.payload as Category,
      };
    }
    case ActionType.SetQuestions: {
      return {
        ...state,
        questions: action.payload as QuestionItem[][],
      };
    }
    case ActionType.StartGame: {
      if (state.gamePageStatus === "started") return state;

      const categoryQuestions =
        state.category === "geography"
          ? state.questions[0]
          : state.questions[1];

      const questions = questionHolder.createQuestion(
        categoryQuestions as QuestionItem[]
      );

      const [currentElement, ...restElements] = questions as Question[];

      return {
        ...state,
        currentQuestion: currentElement,
        nextQuestions: restElements,
        gamePageStatus: "started",
      } as GameInProgressState;
    }
    case ActionType.AnswerQuestion: {
      const isCorrect = isAnswerCorrect({
        answer: action.payload,
        question: state.currentQuestion,
      } as AnsweredQuestion);
      isCorrect && confetti();

      return { ...state, currentAnswer: action.payload as number };
    }
    case ActionType.CheckAnswer: {
      const categoryQuestions = questionHolder.getQuestion();

      if (state.currentQuestionCounter >= categoryQuestions.length - 1)
        return {
          ...state,
          answeredQuestions: [
            {
              question: state.currentQuestion,
              answer: action.payload,
            },
            ...state.answeredQuestions,
          ],
          gamePageStatus: "ended",
        } as GameInProgressState;

      const [currentQuestion, ...nextQuestions] = state.nextQuestions;

      return {
        ...state,
        nextQuestions: nextQuestions,
        currentQuestion: currentQuestion,
        currentAnswer: undefined,
        answeredQuestions: [
          {
            question: state.currentQuestion,
            answer: action.payload,
          },
          ...state.answeredQuestions,
        ],
        currentQuestionCounter: state.currentQuestionCounter + 1,
      } as GameInProgressState;
    }
    case ActionType.RestartGame: {
      questionHolder.setIsCreated(false);
      return { ...initialState, questions: state.questions };
    }
    default:
      return state;
  }
};

function generateAction(type: ActionType, payload?: unknown): Action {
  return { type, payload };
}

export function Game() {
  const [state, dispatch] = useReducer(reducer, initialState);

  async function handleFetch() {
    try {
      const questions = await Promise.all([
        fetchQuestions("geography"),
        fetchQuestions("math"),
      ]);
      dispatch(generateAction(ActionType.SetQuestions, questions));
    } catch (err) {
      throw new Error(err as string);
    }
  }

  const handleStartClick = () => {
    if (state.questions.length) {
      dispatch(generateAction(ActionType.StartGame));
      return;
    }

    asyncAction.setAction([
      () =>
        new Promise((resolve) => {
          asyncAction.performTask(async () => {
            await handleFetch();
            resolve();
          });
        }),
      () =>
        new Promise((resolve) => {
          asyncAction.performTask(() => {
            dispatch(generateAction(ActionType.StartGame));
            resolve();
          });
        }),
    ]);

    asyncAction.runActions();
  };

  const handleAnswerClick = async (answer: Answer) => {
    if (asyncAction.getActions().length > 0) return;

    asyncAction.setAction([
      () =>
        new Promise((resolve) => {
          asyncAction.performTask(() => {
            dispatch(generateAction(ActionType.AnswerQuestion, answer));
            resolve();
          });
        }),
      () =>
        new Promise((resolve) => {
          asyncAction.performTask(() => {
            setTimeout(() => {
              dispatch(generateAction(ActionType.CheckAnswer, answer));
              resolve();
            }, 1500);
          });
        }),
    ]);

    asyncAction.runActions();
  };

  const renderPages = () => {
    switch (state.gamePageStatus) {
      case "not-started": {
        return (
          <GameStart
            category={state.category}
            onCategorySet={(value) =>
              dispatch(generateAction(ActionType.SetCategory, value))
            }
            onStartClick={() => handleStartClick()}
          />
        );
      }
      case "started": {
        return (
          <GameInProgress
            gameInProgressState={state}
            category={state.category}
            onAnswerClick={(answer) => handleAnswerClick(answer)}
          />
        );
      }
      case "ended": {
        return (
          <GameEnd
            gameEndState={{
              tag: "ended",
              answeredQuestions: state.answeredQuestions,
            }}
            onRestart={() => dispatch(generateAction(ActionType.RestartGame))}
          />
        );
      }
      default:
        return <div>Page not found - 404</div>;
    }
  };

  return renderPages();
}
