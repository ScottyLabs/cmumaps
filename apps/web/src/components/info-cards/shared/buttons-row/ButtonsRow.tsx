import { useQueryState } from "nuqs";
import { FaArrowRight } from "react-icons/fa";
import { TbXboxX } from "react-icons/tb";
import ShareButton from "@/components/info-cards/shared/buttons-row/ShareButton";
import useLocationParams from "@/hooks/useLocationParams";
import useBoundStore from "@/store";
import { CardStates } from "@/store/cardSlice";

interface Props {
  middleButton?: React.JSX.Element;
}

const ButtonsRow = ({ middleButton }: Props) => {
  const [_src, setDst] = useQueryState("dst");
  const [_dst, setSrc] = useQueryState("src");
  const { buildingCode } = useLocationParams();
  const setCardStatus = useBoundStore((state) => state.setCardStatus);

  const renderDirectionButton = () => {
    const isRoomAcc = false;

    return (
      <button
        name="DirectionButton"
        type="button"
        className="flex items-center gap-2 rounded-lg bg-[#56b57b] px-3 py-1 text-white disabled:bg-red-600"
        disabled={isRoomAcc}
        onClick={() => {
          if (buildingCode) {
            setDst(buildingCode);
            setSrc("user");
          }
          setCardStatus(CardStates.COLLAPSED);
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
