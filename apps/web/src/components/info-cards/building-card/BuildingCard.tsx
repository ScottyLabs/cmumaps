import { getBuildingsQueryOptions } from "@/api/apiClient";
import ButtonsRow from "@/components/info-cards/shared/buttons-row/ButtonsRow";
import InfoCardImage from "@/components/info-cards/shared/media/InfoCardImage";
import useIsMobile from "@/hooks/useIsMobile";
import useLocationParams from "@/hooks/useLocationParams";
import useBoundStore from "@/store";
import { useQuery } from "@tanstack/react-query";

interface Props {
  mapRef: React.RefObject<mapkit.Map | null>;
}

const BuildingCard = ({ mapRef: _mapRef }: Props) => {
  const isMobile = useIsMobile();
  const isCardCollapsed = useBoundStore((state) => state.isCardCollapsed);
  const { buildingCode } = useLocationParams();
  const { data: buildings } = useQuery(getBuildingsQueryOptions());

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

  return (
    <>
      {(!isCardCollapsed || !isMobile) && renderBuildingImage()}
      <h2 className="ml-3 pt-2">
        {building.name} ({building.code})
      </h2>
      {/* biome-ignore lint/complexity/noUselessFragments: passing empty element to middleButton prop */}
      <ButtonsRow middleButton={<></>} />
    </>
  );
};

export default BuildingCard;
