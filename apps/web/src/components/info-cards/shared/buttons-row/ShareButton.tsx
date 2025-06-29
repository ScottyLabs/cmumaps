import { useState } from "react";
import { toast } from "react-toastify";
import shareIcon from "@/assets/icons/infocard/share.svg";

const ShareButton = () => {
  const [clicked, setClicked] = useState<boolean>(false);

  return (
    <>
      <button
        type="button"
        className={`flex cursor-pointer items-center rounded-full p-1.5 ${clicked ? "bg-green-600" : "bg-[#b5b5b5]"}`}
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setClicked(true);
          toast.success("Link copied!");
        }}
      >
        <img alt="Share Icon" src={shareIcon} className="size-5" />
      </button>
    </>
  );
};

export default ShareButton;
