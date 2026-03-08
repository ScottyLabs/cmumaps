import { HiOutlineMap } from "react-icons/hi2";
import boothData from "@/assets/carnival/json/booth.json" with { type: "json" };
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

const TAG_STYLES: Record<string, string> = {
  club: "bg-[#DDEEFF] text-[#0093E0]",
  fraternity: "bg-[#E4D7FA] text-[#5B3CB7]",
  sorority: "bg-[#FFE3D7] text-[#E35A1C]",
};

const BoothCard = ({ cardStatus }: Props) => {
  const isCollapsed = cardStatus === CardStates.COLLAPSED;
  const isExpanded = cardStatus === CardStates.EXPANDED;
  const showImage = !isCollapsed;
  const showBoothList = !isCollapsed;
  const showDescription = isExpanded;
  const showViewAllButton = !isExpanded;

  const booths = Object.entries(boothData as Record<string, BoothInfo>);

  const renderBadge = (label: string, className: string) => (
    <span className={`rounded-md px-2 py-1 font-bold text-sm ${className}`}>
      {label}
    </span>
  );

  const renderBoothItem = (
    [name, booth]: [string, BoothInfo],
    index: number,
    horizontal: boolean,
  ) => (
    <article
      key={`${name}-${index}`}
      className={`rounded-2xl border border-stroke-neutral-1 bg-white p-3 shadow-sm ${horizontal ? "min-w-[300px]" : ""}`}
    >
      <div className="mb-2 flex gap-2">
        {renderBadge(booth.boothType, "bg-[#FFE3D7] text-[#E35A1C]")}
        {renderBadge(
          booth.orgType,
          TAG_STYLES[booth.orgType.toLowerCase()] ??
            "bg-gray-100 text-gray-700",
        )}
      </div>
      <h3 className="leading-tight">{name}</h3>
      <p className="mt-1 text-gray-500">Theme: {booth.theme}</p>
    </article>
  );

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
          {booths.map((entry, index) => renderBoothItem(entry, index, false))}
        </div>
      );
    }

    return (
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-3 py-4">
        {booths.map((entry, index) => renderBoothItem(entry, index, true))}
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
