import { useQueryState } from "nuqs";
import React from "react";
import { useNavigate } from "react-router";
import { BoothCard } from "@/components/booth-cards/BoothCard.tsx";
import { SpecificBoothCard } from "@/components/booth-cards/SpecificBoothCard.tsx";
import { BuildingCard } from "@/components/info-cards/building-card/BuildingCard.tsx";
import { CoordinateCard } from "@/components/info-cards/coordinate-card/CoordinateCard.tsx";
import { NavCardDesktop } from "@/components/info-cards/nav-card-desktop/NavCardDesktop.tsx";
import { RoomCard } from "@/components/info-cards/room-card/RoomCard.tsx";
import { DraggableSheet } from "@/components/info-cards/wrapper/DraggableSheet.tsx";
import { useIsMobile } from "@/hooks/useIsMobile.ts";
import { useLocationParams } from "@/hooks/useLocationParams.ts";
import { useBoundStore } from "@/store/index.ts";
import { BuggyCard } from "../buggy-cards/BuggyCard.tsx";

interface Props {
  mapRef: React.RefObject<mapkit.Map | null>;
}

const InfoCard = ({ mapRef }: Props) => {
  const isMobile = useIsMobile();
  const { boothName, buildingCode, roomName, coordinate, carnivalEvent } =
    useLocationParams();
  const isSearchOpen = useBoundStore((state) => state.isSearchOpen);
  const cardStatus = useBoundStore((state) => state.cardStatus);

  // TODO: determine why useNavigationParams causes constant rerenders
  const [src, setSrc] = useQueryState("src");
  const [_dst, setDst] = useQueryState("dst");
  const navigate = useNavigate();
  const isNavOpen = Boolean(src);

  if (isSearchOpen) {
    return;
  }

  const renderCard = () => {
    if (isNavOpen && !isMobile) {
      return {
        snapPoints: [],
        element: () => <NavCardDesktop mapRef={mapRef} />,
      };
    }
    if (coordinate) {
      return {
        snapPoints: [154],
        element: () => <CoordinateCard mapRef={mapRef} />,
      };
    }
    if (carnivalEvent === "booth" && boothName) {
      return {
        snapPoints: [175, 470, window.innerHeight],
        element: () => (
          <SpecificBoothCard boothName={boothName} cardStatus={cardStatus} />
        ),
      };
    }
    if (carnivalEvent === "booth") {
      return {
        snapPoints: [175, 520, window.innerHeight],
        element: () => <BoothCard cardStatus={cardStatus} />,
      };
    }
    if (carnivalEvent === "buggy") {
      return {
        snapPoints: [154, 560, window.innerHeight],
        element: () => <BuggyCard mapRef={mapRef} />,
      };
    }
    if (roomName) {
      return {
        snapPoints: [178, 310, window.innerHeight],
        element: () => <RoomCard />,
      };
    }
    if (buildingCode) {
      return {
        snapPoints: [154, 288, window.innerHeight],
        element: () => <BuildingCard mapRef={mapRef} />,
      };
    }
    return {
      snapPoints: [],
      element: () => <></>,
    };
  };

  const { snapPoints, element } = renderCard();

  if (isMobile) {
    return (
      !isNavOpen && (
        <DraggableSheet
          snapPoints={snapPoints}
          onClose={async () => {
            await navigate("/");
            setSrc(null);
            setDst(null);
          }}
        >
          {React.createElement(element)}
        </DraggableSheet>
      )
    );
  }
  return (
    <div className="flex w-96 flex-col overflow-hidden rounded-lg bg-white shadow-gray-400 shadow-lg">
      {React.createElement(element)}
    </div>
  );
};

export { InfoCard };
