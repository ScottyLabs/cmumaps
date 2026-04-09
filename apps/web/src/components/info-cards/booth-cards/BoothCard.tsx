// biome-ignore-all lint/nursery/noUnnecessaryConditions: showBoothList and showViewAllButton are temporarily set to false
import { HiOutlineMap } from "react-icons/hi2";
import { useNavigate } from "react-router";
import boothData from "@/assets/carnival/json/booth.json" with { type: "json" };
import { BoothEventCard } from "@/components/info-cards/booth-cards/BoothEventCard";
import { ButtonsRow } from "@/components/info-cards/shared/buttons-row/ButtonsRow";
import { InfoCardImage } from "@/components/info-cards/shared/media/InfoCardImage.tsx";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { CardStatus } from "@/store/cardSlice.ts";
import { CardStates } from "@/store/cardSlice.ts";
import { useBoundStore } from "@/store/index.ts";

interface Props {
  cardStatus: CardStatus;
}

interface BoothInfo {
  boothType: string;
  orgType: string;
  theme: string;
}

const BoothCard = ({ cardStatus }: Props) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isCollapsed = cardStatus === CardStates.COLLAPSED && isMobile;
  const isExpanded = cardStatus === CardStates.EXPANDED || !isMobile;
  const setCardStatus = useBoundStore((state) => state.setCardStatus);

  const showImage = !isCollapsed;

  // TODO: switch once booths json has been updated to include 2026 booths
  // const showBoothList = !isCollapsed;
  // const showViewAllButton = !isExpanded;
  // const showDescription = isExpanded;

  const showBoothList = false;
  const showViewAllButton = false;
  const showDescription = !isCollapsed;

  const booths = Object.entries(boothData as Record<string, BoothInfo>);

  const renderMiddleButton = () => (
    <button
      type="button"
      className="flex items-center gap-2 rounded-full bg-primary-red px-5 py-2 text-white"
      onClick={() => setCardStatus(CardStates.EXPANDED)}
    >
      <HiOutlineMap size={16} />
      <span>View all booth</span>
    </button>
  );

  const openSpecificBooth = (boothName: string) => {
    setCardStatus(CardStates.HALF_OPEN);
    Promise.resolve(
      navigate(`/carnival/booth/${encodeURIComponent(boothName)}`),
    ).catch(() => undefined);
  };

  const renderBoothList = () => {
    if (isExpanded) {
      return (
        <div className="space-y-4 px-3 py-4">
          {booths.map(([name, booth]) => (
            <BoothEventCard
              boothType={booth.boothType}
              horizontal={false}
              key={name}
              name={name}
              onClick={() => openSpecificBooth(name)}
              orgType={booth.orgType}
              theme={booth.theme}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="no-scrollbar flex items-start gap-3 overflow-x-auto px-3 pt-4 pb-0">
        {booths.map(([name, booth]) => (
          <BoothEventCard
            boothType={booth.boothType}
            horizontal={true}
            key={name}
            name={name}
            onClick={() => openSpecificBooth(name)}
            orgType={booth.orgType}
            theme={booth.theme}
          />
        ))}
      </div>
    );
  };

  const renderDescription = () => (
    <div className="px-3 py-4 text-gray-900">
      Booth is one of the biggest showcases of Spring Carnival. Student
      organizations build multi-story structures around their chosen theme.
      These booths include interactive games and elaborate decorations. The
      booths are located on Midway, at the College of Fine Arts parking lot.
      Admission is free to see booths.
    </div>
  );

  return (
    <div className={isMobile ? "" : "overflow-scroll"}>
      {showImage ? (
        <InfoCardImage url="/imgs/carnival/booth.png" alt="Booth" />
      ) : null}
      <div className="mx-3 mt-2">
        <h2>Booth</h2>
        <p className="text-gray-500">Midway</p>
      </div>
      <ButtonsRow
        middleButton={showViewAllButton ? renderMiddleButton() : undefined}
      />
      {showBoothList ? (
        <div className="border-stroke-neutral-1 border-t" />
      ) : null}
      {showDescription ? (
        <>
          {renderDescription()}
          <div className="border-stroke-neutral-1 border-t" />
        </>
      ) : null}
      {showBoothList ? renderBoothList() : null}
    </div>
  );
};

export { BoothCard };
