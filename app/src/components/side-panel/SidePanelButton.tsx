import { twMerge } from "tailwind-merge";

interface Props {
  text: string;
  handleClick: () => void;
  style?: string;
}

const SidePanelButton = ({ text, handleClick, style }: Props) => {
  return (
    <button
      className={twMerge(
        "rounded bg-blue-500 px-4 py-2 text-sm font-bold text-nowrap text-emerald-200 hover:bg-blue-700",
        style,
      )}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

export default SidePanelButton;
