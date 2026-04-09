import { HiOutlineMap } from "react-icons/hi2";
import { useNavigate } from "react-router";
import boothData from "@/assets/carnival/json/booth.json" with { type: "json" };
import { ButtonsRow } from "@/components/info-cards/shared/buttons-row/ButtonsRow";
import { InfoCardImage } from "@/components/info-cards/shared/media/InfoCardImage.tsx";
import type { CardStatus } from "@/store/cardSlice.ts";
import { CardStates } from "@/store/cardSlice.ts";
import { useBoundStore } from "@/store/index.ts";

interface Props {
  boothName: string;
  cardStatus: CardStatus;
}

interface BoothInfo {
  boothType: string;
  orgType: string;
  theme: string;
}

const ORG_TAG_STYLES: Record<string, string> = {
  club: "bg-[#DDEEFF] text-[#0093E0]",
  fraternity: "bg-[#E4D7FA] text-[#5B3CB7]",
  sorority: "bg-[#FFE3D7] text-[#E35A1C]",
};

const SpecificBoothCard = ({ boothName, cardStatus }: Props) => {
  const navigate = useNavigate();
  const setCardStatus = useBoundStore((state) => state.setCardStatus);
  const isCollapsed = cardStatus === CardStates.COLLAPSED;
  const booth = (boothData as Record<string, BoothInfo>)[boothName];

  if (!booth) {
    return null;
  }

  const renderBadge = (label: string, className: string) => (
    <span className={`rounded-md px-2 py-1 font-bold text-sm ${className}`}>
      {label}
    </span>
  );

  const renderMiddleButton = () => (
    <button
      type="button"
      className="flex items-center gap-2 rounded-full bg-primary-red px-5 py-2 text-white"
      onClick={() => {
        setCardStatus(CardStates.HALF_OPEN);
        Promise.resolve(navigate("/carnival/booth")).catch(() => undefined);
      }}
    >
      <HiOutlineMap size={16} />
      <span>View all booth</span>
    </button>
  );

  return (
    <div className="flex min-h-full flex-col">
      {isCollapsed ? null : (
        <InfoCardImage url="/imgs/carnival/booth.png" alt={boothName} />
      )}
      <div className="mx-3 mt-2">
        {isCollapsed ? null : (
          <div className="mb-3 flex gap-2">
            {renderBadge(booth.boothType, "bg-[#FFE3D7] text-[#E35A1C]")}
            {renderBadge(
              booth.orgType,
              ORG_TAG_STYLES[booth.orgType.toLowerCase()] ??
                "bg-gray-100 text-gray-700",
            )}
          </div>
        )}
        <h2 className="leading-tight">{boothName}</h2>
      </div>
      <ButtonsRow middleButton={renderMiddleButton()} />
      {isCollapsed ? null : (
        <div className="flex-1 px-3 pb-4 text-gray-900">
          This booth description is placeholder copy for now. It gives us enough
          text to match the layout while we build the specific booth experience
          and can be replaced with the real content later.
        </div>
      )}
    </div>
  );
};

export { SpecificBoothCard };
