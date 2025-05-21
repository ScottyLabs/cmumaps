import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient";
import ButtonsRow from "@/components/info-cards/shared/buttons-row/ButtonsRow";
import InfoCardImage from "@/components/info-cards/shared/media/InfoCardImage";
import useIsMobile from "@/hooks/useIsMobile";
import useLocationParams from "@/hooks/useLocationParams";
import { selectCardCollapsed } from "@/store/features/cardSlice";
import { useAppSelector } from "@/store/hooks";

interface Props {
  mapRef: React.RefObject<mapkit.Map | null>;
}

const BuildingCard = ({ mapRef: _mapRef }: Props) => {
  const { buildingCode } = useLocationParams();
  const isMobile = useIsMobile();
  const cardCollapsed = useAppSelector(selectCardCollapsed);
  const { data: buildings } = useQuery({
    queryKey: ["buildings"],
    queryFn: apiClient("buildings"),
  });

  if (!buildingCode || !buildings) {
    return;
  }

  const building = buildings[buildingCode];
  if (!building) {
    return;
  }

  const renderBuildingImage = () => {
    const url = `/location_images/building_room_images/${building.code}/${building.code}.jpg`;

    return <InfoCardImage url={url} alt={`${building.name} Image`} />;
  };

  const renderButtonsRow = () => {
    return <ButtonsRow middleButton={<></>} />;
  };

  return (
    <>
      {(!cardCollapsed || !isMobile) && renderBuildingImage()}
      <h2 className="ml-3 pt-2">
        {building.name} ({building.code})
      </h2>
      {renderButtonsRow()}
    </>
  );
};

export default BuildingCard;
