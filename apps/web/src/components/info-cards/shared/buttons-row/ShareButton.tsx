import { useState } from "react";
import { toast } from "react-toastify";
import shareIcon from "@/assets/icons/infocard/share.svg";

const ShareButton = () => {
  const [clicked, setClicked] = useState<boolean>(false);

  return (
    <button
      type="button"
      className={`my-auto flex cursor-pointer items-center rounded-full p-1.5 ${clicked ? "bg-green-600" : "bg-background-brand-secondary-pressed"}`}
      onClick={() => {
        navigator.clipboard.writeText(window.location.href);
        setClicked(true);
        toast.success("Link copied!");
      }}
    >
      <img alt="Share Icon" src={shareIcon} className="size-5" />
    </button>
  );
};

export default ShareButton;
