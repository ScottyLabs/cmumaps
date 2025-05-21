import React from "react";

import RoomCard from "@/components/info-cards/room-card/RoomCard";
import DraggableSheet from "@/components/info-cards/wrapper/DraggableSheet";
import useIsMobile from "@/hooks/useIsMobile";
import useLocationParams from "@/hooks/useLocationParams";
import useUiStore from "@/store/searchSlice";

import BuildingCard from "../building-card/BuildingCard";

interface Props {
  mapRef: React.RefObject<mapkit.Map | null>;
}

const InfoCard = ({ mapRef }: Props) => {
  const isMobile = useIsMobile();
  const { buildingCode, roomName } = useLocationParams();
  const isSearchOpen = useUiStore((state) => state.isSearchOpen);

  if (isSearchOpen) {
    return <></>;
  }

  const renderCard = () => {
    if (roomName) {
      // TODO: should change based on if has schedule
      return {
        snapPoints: [166, 310, window.innerHeight],
        element: () => <RoomCard />,
      };
    } else if (buildingCode) {
      // TODO: should change based on if has food eateries
      // eateries.length > 0 ? 460 : 288));
      return {
        snapPoints: [142, 288, window.innerHeight],
        element: () => <BuildingCard mapRef={mapRef} />,
      };
    } else {
      return {
        snapPoints: [],
        element: () => <></>,
      };
    }
  };

  const { snapPoints, element } = renderCard();

  if (isMobile) {
    return (
      <DraggableSheet snapPoints={snapPoints}>
        {React.createElement(element)}
      </DraggableSheet>
    );
  } else {
    return (
      <div className="flex w-96 flex-col overflow-hidden rounded-lg bg-white shadow-lg shadow-gray-400">
        {React.createElement(element)}
      </div>
    );
  }
};

export default InfoCard;
