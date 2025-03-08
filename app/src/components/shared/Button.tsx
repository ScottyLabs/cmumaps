import { twMerge } from "tailwind-merge";

interface Props {
  text: string;
  handleClick: () => void;
  style?: string;
}

const Button = ({ text, handleClick, style }: Props) => {
  return (
    <div>
      <button
        className={twMerge(
          "mb-2 rounded bg-slate-500 px-2 py-1 text-sm text-white hover:bg-slate-700",
          style,
        )}
        onClick={handleClick}
      >
        {text}
      </button>
    </div>
  );
};

export default Button;
