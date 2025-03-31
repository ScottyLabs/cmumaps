import { useEffect } from "react";

import ButtonsRow from "@/components/info-cards/ButtonsRow";
import InfoCardImage from "@/components/info-cards/InfoCardImage";
import useIsMobile from "@/hooks/useIsMobile";
import useLocationParams from "@/hooks/useLocationParams";
import { useGetBuildingsQuery } from "@/store/features/api/apiSlice";
import { selectCardCollapsed, setSnapPoints } from "@/store/features/cardSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

interface Props {
  map: mapkit.Map | null;
}

const BuildingCard = ({ map: _map }: Props) => {
  const dispatch = useAppDispatch();

  const { buildingCode } = useLocationParams();
  const { data: buildings } = useGetBuildingsQuery();
  const isMobile = useIsMobile();
  const cardCollapsed = useAppSelector(selectCardCollapsed);

  // set the mid snap point
  // TODO: should change based on if has food eateries
  // eateries.length > 0 ? 460 : 288));
  useEffect(() => {
    dispatch(setSnapPoints([142, 288, screen.availHeight]));
  }, [dispatch]);

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
