import { Stats, Button } from "react-daisyui";
import {
  AnsweredQuestion,
  isAnswerCorrect,
  questionItem,
  toStat,
} from "../questions";
import { GameEndState } from "../state";
import { GiRibbonMedal } from "react-icons/gi";
import { ImCheckmark, ImCross } from "react-icons/im";
import { VscDebugRestart } from "react-icons/vsc";

type Props = {
  gameEndState: GameEndState;
  onRestart: () => void;
};

export function GameEnd({
  gameEndState: { answeredQuestions },
  onRestart,
}: Props) {
  const { score, countCorrect, countTotal } = toStat(answeredQuestions);

  const statBgColor =
    score === 1 ? "bg-success" : score > 0.5 ? "bg-primary" : "bg-secondary";
  const statTextColor =
    score === 1
      ? "text-success-content"
      : score > 0.5
      ? "text-primary-content"
      : "text-secondary-content";

  const statText =
    score > 0.8
      ? "Impressive"
      : score > 0.5
      ? "Well done"
      : score > 0.0
      ? "Good start"
      : "Don't give up!";

  return (
    <>
      <Stats
        className={`shadow px-4 select-none animate-fadein ${statBgColor} ${statTextColor}`}
      >
        <Stats.Stat>
          <Stats.Stat.Item variant="title" className={statTextColor}>
            Result
          </Stats.Stat.Item>
          <Stats.Stat.Item variant="value">
            <span className="font-bold text-9xl" data-testid="count-correct">
              {countCorrect}
            </span>
            <span className="text-5xl">/</span>
            <span className="text-3xl" data-testid="count-total">
              {countTotal}
            </span>
          </Stats.Stat.Item>
          <Stats.Stat.Item variant="desc" className={statTextColor}>
            {statText}
          </Stats.Stat.Item>
          <GiRibbonMedal
            size="120px"
            color="white"
            className="absolute -mt-[30px] -ml-[86px] z-50"
          />
        </Stats.Stat>
      </Stats>
      <Table questions={answeredQuestions} />
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={onRestart}
          className="justify-start gap-2"
          data-testid="try-again-button"
        >
          <VscDebugRestart />
          Try again
        </Button>
      </div>
    </>
  );
}

function Table({ questions }: { questions: Array<AnsweredQuestion> }) {
  return (
    <div className="my-6 overflow-x-auto shadow">
      <table className="table w-full">
        <thead className="hidden sm:table-header-group">
          <tr>
            <th></th>
            <th>Name</th>
            <th>Signature</th>
          </tr>
        </thead>
        <tbody>
          {questions.reverse().map((aq, index) => (
            <tr key={index}>
              <th className="py-0.5 pr-1 sm:pr-3">
                {isAnswerCorrect(aq) ? (
                  <ImCheckmark className="text-success" />
                ) : (
                  <ImCross className="text-error" />
                )}
              </th>
              <td className="py-0.5 pr-1 font-bold sm:pr-3">
                {questionItem(aq.question).title}
              </td>
              <td className="hidden py-0.5 pr-1 sm:table-cell sm:pr-3">
                <pre className="max-w-lg font-mono font-medium truncate">
                  {questionItem(aq.question).answer}
                </pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
