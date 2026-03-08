import { HiOutlineMap } from "react-icons/hi2";
import boothData from "@/assets/carnival/json/booth.json" with { type: "json" };
import { BoothEventCard } from "@/components/booth-cards/BoothEventCard.tsx";
import { ButtonsRow } from "@/components/info-cards/shared/buttons-row/ButtonsRow";
import { InfoCardImage } from "@/components/info-cards/shared/media/InfoCardImage.tsx";
import type { CardStatus } from "@/store/cardSlice.ts";
import { CardStates } from "@/store/cardSlice.ts";

interface Props {
  cardStatus: CardStatus;
}

interface BoothInfo {
  boothType: string;
  orgType: string;
  theme: string;
}

const BoothCard = ({ cardStatus }: Props) => {
  const isCollapsed = cardStatus === CardStates.COLLAPSED;
  const isExpanded = cardStatus === CardStates.EXPANDED;
  const showImage = !isCollapsed;
  const showBoothList = !isCollapsed;
  const showDescription = isExpanded;
  const showViewAllButton = !isExpanded;

  const booths = Object.entries(boothData as Record<string, BoothInfo>);

  const renderMiddleButton = () => (
    <button
      type="button"
      className="flex items-center gap-2 rounded-full bg-primary-red px-5 py-2 text-white"
    >
      <HiOutlineMap size={16} />
      <span>View all booth</span>
    </button>
  );

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
              orgType={booth.orgType}
              theme={booth.theme}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-3 py-4">
        {booths.map(([name, booth]) => (
          <BoothEventCard
            boothType={booth.boothType}
            horizontal={true}
            key={name}
            name={name}
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
    <>
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
    </>
  );
};

export { BoothCard };
