type Props = {
  source: string;
  color?: string;
  text: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleClick?: () => void | Promise<any>;
};

const Button = ({ source, color, text, handleClick }: Props) => {
  return (
    <button
      className={`cursor-pointer gap-2 items-center font-medium flex ${
        color ?? "text-Moderate-blue"
      }`}
      onClick={handleClick}
    >
      <img src={source} alt="" aria-hidden />
      {text}
    </button>
  );
};

export default Button;
