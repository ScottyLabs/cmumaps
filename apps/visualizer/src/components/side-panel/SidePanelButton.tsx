import { twMerge } from "tailwind-merge";

interface Props {
  text: string;
  handleClick: () => void;
  style?: string;
}

const SidePanelButton = ({ text, handleClick, style }: Props) => {
  return (
    <button
      type="button"
      className={twMerge(
        "block text-nowrap rounded bg-blue-500 px-4 py-2 font-bold text-emerald-200 text-sm hover:bg-blue-700",
        style,
      )}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

export default SidePanelButton;
