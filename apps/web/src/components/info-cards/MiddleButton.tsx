import { ReactElement } from "react";

interface Props {
  title: string;
  icon: ReactElement;
  url: string;
}

const MiddleButton = ({ title, icon, url }: Props) => {
  return (
    <a href={url} target="_blank" rel="noreferrer">
      <button
        type="button"
        className="flex h-full items-center gap-2 rounded-lg bg-[#1e86ff] px-3 py-1 text-white"
      >
        {icon}
        <p>{title}</p>
      </button>
    </a>
  );
};

export default MiddleButton;
