import { GameInProgressState } from "../../state";
import { isAnswerCorrect } from "../../questions";
import {
  ImCross,
  ImCheckmark,
  ImRadioChecked,
  ImRadioUnchecked,
} from "react-icons/im";

type Props = { gameInProgressState: GameInProgressState };

export function GameSteps({
  gameInProgressState: {
    answeredQuestions,
    currentQuestion,
    currentAnswer,
    nextQuestions,
  },
}: Props) {
  const answered: Array<StepResult> = answeredQuestions
    .slice()
    .reverse()
    .map((answeredQuestion) =>
      isAnswerCorrect(answeredQuestion) ? "success" : "error"
    );

  const current: StepResult = currentAnswer
    ? currentAnswer === currentQuestion.correctOption
      ? "success"
      : "error"
    : "current";

  const next: Array<StepResult> = nextQuestions.map(() => "next");

  const ulClass = `steps max-w-full overflow-hidden font-medium text-sm pt-4 sm:pt-0 ${
    answered.length > 2 ? "justify-end" : "justify-start"
  }`;
  return (
    <ul className={ulClass}>
      {answered.map((step, index) => (
        <Step step={step} key={index} />
      ))}
      <Step step={current} />
      {next.map((step, index) => (
        <Step step={step} key={index} />
      ))}
    </ul>
  );
}

type StepResult = "success" | "error" | "current" | "next";
type StepProp = { step: StepResult };

function Step({ step }: StepProp) {
  const liClass = `step gap - 2 ${step !== "next" ? "step-neutral" : ""}`;
  if (step === "success") {
    return (
      <li className={liClass}>
        <ImCheckmark className="text-success" />
      </li>
    );
  } else if (step === "next") {
    return (
      <li className={liClass}>
        <ImRadioUnchecked className="text-neutral" />
      </li>
    );
  } else if (step === "current") {
    return (
      <li className={liClass}>
        <ImRadioChecked color="white" className="text-neutral" />
      </li>
    );
  } else {
    return (
      <li className={liClass}>
        <ImCross className="text-error" />
      </li>
    );
  }
}
