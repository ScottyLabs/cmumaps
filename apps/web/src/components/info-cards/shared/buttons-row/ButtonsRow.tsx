import { FaArrowRight } from "react-icons/fa";
import { TbXboxX } from "react-icons/tb";
import { ShareButton } from "@/components/info-cards/shared/buttons-row/ShareButton.tsx";
import { useLocationParams } from "@/hooks/useLocationParams.ts";
import { useNavPaths } from "@/hooks/useNavigationParams.ts";
import { CardStates } from "@/store/cardSlice";
import { useBoundStore } from "@/store/index.ts";

interface Props {
  middleButton?: React.JSX.Element;
}

const ButtonsRow = ({ middleButton }: Props) => {
  const { setSrc, setDst } = useNavPaths();
  const { buildingCode, roomName, coordinate } = useLocationParams();
  const setCardStatus = useBoundStore((state) => state.setCardStatus);

  const renderDirectionButton = () => {
    const isRoomAcc = false;

    return (
      <button
        name="DirectionButton"
        type="button"
        className="flex items-center gap-2 rounded-full bg-button-green px-3 py-2 text-white disabled:bg-red-600"
        disabled={isRoomAcc}
        onClick={() => {
          if (buildingCode) {
            if (roomName) {
              setDst(`${buildingCode}-${roomName}`);
            } else {
              setDst(buildingCode);
            }
            setSrc("user");
          } else if (coordinate) {
            setDst(`${coordinate.latitude},${coordinate.longitude}`);
            setSrc("user");
          }
          setCardStatus(CardStates.COLLAPSED);
        }}
      >
        {/** biome-ignore lint/nursery/noUnnecessaryConditions: need to calculate isRoomAcc later */}
        {isRoomAcc ? <TbXboxX size={20} /> : <FaArrowRight size={12} />}
        {/** biome-ignore lint/nursery/noUnnecessaryConditions: need to calculate isRoomAcc later */}
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
      <div>
        <ShareButton />
      </div>
    </div>
  );
};

export { ButtonsRow };
