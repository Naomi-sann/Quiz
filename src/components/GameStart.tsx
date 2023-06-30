import { Button } from "react-daisyui";
import { VscDebugStart } from "react-icons/vsc";
import { BiMath, BiMap } from "react-icons/bi";
import { Category } from "../questions";

type Props = {
  category: Category;
  onStartClick: () => void;
  onCategorySet: (category: Category) => void;
};

export function GameStart({ category, onStartClick, onCategorySet }: Props) {
  function buttonColor(c: Category) {
    if (category === c) return "secondary";
    return undefined;
  }

  function buttonClasses(c: Category) {
    if (category === c) return "opacity-100 flex-col gap-2 min-w-fit w-24 h-20";
    return "flex-col gap-2 min-w-fit w-24 h-20 opacity-50";
  }

  return (
    <>
      <div className="flex flex-row flex-nowrap btn-group">
        <Button
          color={buttonColor("geography")}
          className={buttonClasses("geography")}
          onClick={() => onCategorySet("geography")}
          data-testid="geography-category"
        >
          <BiMap size="24px" />
          Geography
        </Button>
        <Button
          color={buttonColor("math")}
          className={buttonClasses("math")}
          onClick={() => onCategorySet("math")}
          data-testid="math-category"
        >
          <BiMath size="24px" />
          Math
        </Button>
      </div>

      <Button
        data-testid="start-button"
        color="primary"
        className="mt-8 gap-2"
        onClick={onStartClick}
      >
        <VscDebugStart />
        Start
      </Button>
    </>
  );
}
