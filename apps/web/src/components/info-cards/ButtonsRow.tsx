import { FaArrowRight } from "react-icons/fa";
import { TbXboxX } from "react-icons/tb";
import { toast } from "react-toastify";

import ShareButton from "@/components/info-cards/ShareButton";

interface Props {
  middleButton: React.JSX.Element;
}

const ButtonsRow = ({ middleButton }: Props) => {
  const renderDirectionButton = () => {
    const isRoomAcc = false;

    return (
      <button
        id="DirectionButton"
        type="button"
        className="flex items-center gap-2 rounded-lg bg-[#56b57b] px-3 py-1 text-white disabled:bg-red-600"
        disabled={isRoomAcc}
        onClick={() => {
          toast.warn("Will be implemented!");
        }}
      >
        {isRoomAcc ? <TbXboxX size={20} /> : <FaArrowRight size={12} />}
        <p>{isRoomAcc ? "Not Accessible" : "Directions"}</p>
      </button>
    );
  };

  return (
    <div className="mx-3 flex justify-between py-3">
      <div className="flex gap-2.5">
        {renderDirectionButton()}
        {middleButton}
      </div>
      <ShareButton />
    </div>
  );
};

export default ButtonsRow;
