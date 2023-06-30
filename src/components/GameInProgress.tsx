import { GameInProgressState } from "../state";
import { GameSteps } from "./GameInProgress/GameSteps";
import {
  QuestionItem,
  questionItem,
  Option,
  Answer,
  Category,
  showOption,
} from "../questions";
import { Button, Badge } from "react-daisyui";

type Props = {
  gameInProgressState: GameInProgressState;
  onAnswerClick: (answer: Answer) => void;
  category: Category;
};

export function GameInProgress({
  gameInProgressState,
  onAnswerClick,
  category,
}: Props) {
  const { currentQuestion, currentAnswer } = gameInProgressState;
  const { correctOption } = currentQuestion;

  return (
    <div className="flex flex-col items-center justify-start w-full h-full gap-8 sm:justify-center">
      <GameSteps gameInProgressState={gameInProgressState} />

      <div className="flex-1 w-full max-w-2xl mx-2 shadow-xl card sm:flex-initial sm:min-h-[440px] bg-base-200">
        <div className="z-10 items-center justify-between text-center card-body gap-4">
          <h2 className="select-none card-title text-secondary whitespace-nowrap">
            {category === "math" && "What is the result?"}
            {category === "geography" && "Which city is the capital?"}
          </h2>
          <div className="flex flex-col items-center justify-center w-full">
            <h1 className="flex flex-col font-mono text-xl font-medium gap-2 sm:text-2xl">
              {questionItem(currentQuestion).title}
            </h1>
          </div>
          <div>
            <OptionButton
              option={Option.A}
              questionItem={currentQuestion.optionA}
              currentAnswer={currentAnswer}
              correctOption={correctOption}
              onClick={onAnswerClick}
            />
            <OptionButton
              option={Option.B}
              questionItem={currentQuestion.optionB}
              currentAnswer={currentAnswer}
              correctOption={correctOption}
              onClick={onAnswerClick}
            />
            <OptionButton
              option={Option.C}
              questionItem={currentQuestion.optionC}
              currentAnswer={currentAnswer}
              correctOption={correctOption}
              onClick={onAnswerClick}
            />
            <OptionButton
              option={Option.D}
              questionItem={currentQuestion.optionD}
              currentAnswer={currentAnswer}
              correctOption={correctOption}
              onClick={onAnswerClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type OptionResult = "error" | "correct" | "default";

function optionResultToColor(optionResult: OptionResult) {
  switch (optionResult) {
    case "default":
      return undefined;
    case "error":
      return "error";
    case "correct":
      return "success";
  }
}

type OptionButtonProps = {
  option: Option;
  questionItem: QuestionItem;
  currentAnswer?: Answer;
  correctOption: Option;
  onClick: (answer: Answer) => void;
};

function OptionButton({
  option,
  questionItem,
  currentAnswer,
  correctOption,
  onClick,
}: OptionButtonProps) {
  const optionResult: OptionResult =
    currentAnswer !== undefined &&
    currentAnswer === option &&
    option !== correctOption
      ? "error"
      : currentAnswer !== undefined && option === correctOption
      ? "correct"
      : "default";

  return (
    <Button
      color={optionResultToColor(optionResult)}
      className={`justify-start w-64 m-2 gap-4 flex-nowrap ${
        optionResult === "error" ? "animate-wiggle" : ""
      } ${
        currentAnswer !== undefined ? "pointer-events-none" : ""
      } btn-default`}
      onClick={() => onClick(option)}
      data-testid={`${
        correctOption === option ? "question-answer" : "question-option"
      }`}
      key={option + questionItem.answer}
    >
      <Badge size="lg" color="secondary">
        {showOption(option)}
      </Badge>
      <code className="font-mono text-lg font-medium normal-case truncate">
        {questionItem.answer}
      </code>
    </Button>
  );
}
