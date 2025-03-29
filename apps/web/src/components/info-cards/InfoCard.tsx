import RoomCard from "@/components/info-cards/RoomCard";
import useLocationParams from "@/hooks/useLocationParams";

import BuildingCard from "./BuildingCard";

interface Props {
  map: mapkit.Map | null;
}

const InfoCard = ({ map }: Props) => {
  const { buildingCode, roomName } = useLocationParams();

  if (roomName) {
    return <RoomCard />;
  } else if (buildingCode) {
    return <BuildingCard map={map} />;
  } else {
    return <></>;
  }
};

export default InfoCard;
