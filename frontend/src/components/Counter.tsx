import { useState } from "react";
import MinusIcon from "../assets/icon-minus.svg";
import PlusIcon from "../assets/icon-plus.svg";

interface Props {
  count: number;
}

const Counter = ({ count }: Props) => {
  const [initialCount] = useState(count);
  const [counter, setCounter] = useState(count);
  const [userVote, setUserVote] = useState(0); // 0: sin voto, 1: voto positivo, -1: voto negativo

  const increment = () => {
    if (userVote === 0) {
      // Si no ha votado
      setCounter(initialCount + 1);
      setUserVote(1);
    } else if (userVote === 1) {
      // Si ya votó positivo, quitar el voto
      setCounter(initialCount);
      setUserVote(0);
    } // Si ya votó negativo, no hacer nada
  };

  const decrement = () => {
    if (userVote === 0 && counter > 0) {
      // Si no ha votado
      setCounter(initialCount - 1);
      setUserVote(-1);
    } else if (userVote === -1) {
      // Si ya votó negativo, quitar el voto
      setCounter(initialCount);
      setUserVote(0);
    } // Si ya votó positivo, no hacer nada
  };

  return (
    <div className="flex rounded-md items-center gap-3 px-3 py-1 bg-Light-gray md:flex-col md:py-3">
      <button
        className={`cursor-pointer relative after:absolute after:content-[''] after:w-6 after:top-1/2 after:right-1/2 after:translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:z-10 ${
          userVote === 1 ? "after:h-6 after:bg-Moderate-blue/30" : "after:h-0"
        } hover:after:h-6 hover:after:bg-Moderate-blue/10`}
        onClick={increment}
      >
        <img src={PlusIcon} alt="" aria-hidden className="object-contain" />
      </button>
      <span className="text-Moderate-blue font-medium min-w-[20px] text-center">
        {counter}
      </span>
      <button
        className={`cursor-pointer relative after:absolute after:content-[''] after:w-6 after:top-1/2 after:right-1/2 after:translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:z-10 ${
          userVote === -1 ? "after:h-6 after:bg-Moderate-blue/30" : "after:h-0"
        } hover:after:h-6 hover:after:bg-Moderate-blue/10`}
        onClick={decrement}
      >
        <img src={MinusIcon} alt="" aria-hidden className="object-contain" />
      </button>
    </div>
  );
};

export default Counter;
