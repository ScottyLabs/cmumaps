import ButtonsRow from "@/components/info-cards/ButtonsRow";
import CardWrapper from "@/components/info-cards/CardWrapper";
import InfoCardImage from "@/components/info-cards/InfoCardImage";
import useLocationParams from "@/hooks/useLocationParams";
import { useGetBuildingsQuery } from "@/store/features/api/apiSlice";
import { selectCardCollapsed } from "@/store/features/uiSlice";
import { useAppSelector } from "@/store/hooks";

interface Props {
  map: mapkit.Map | null;
}

const BuildingCard = ({ map: _map }: Props) => {
  const { buildingCode } = useLocationParams();
  const { data: buildings } = useGetBuildingsQuery();
  const cardCollapsed = useAppSelector(selectCardCollapsed);

  if (!buildingCode || !buildings) {
    return;
  }

  const building = buildings[buildingCode];
  if (!building) {
    return;
  }

  const renderBuildingImage = () => {
    const url = `/assets/location_images/building_room_images/${building.code}/${building.code}.jpg`;

    return <InfoCardImage url={url} alt={`${building.name} Image`} />;
  };

  const renderButtonsRow = () => {
    return <ButtonsRow middleButton={<></>} />;
  };

  return (
    <CardWrapper snapPoint={295}>
      <>
        {!cardCollapsed && renderBuildingImage()}
        <h2 className="ml-3 pt-2">
          {building.name} ({building.code})
        </h2>
        {renderButtonsRow()}
      </>
    </CardWrapper>
  );
};

export default BuildingCard;
