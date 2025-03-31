import RoomCard from "@/components/info-cards/room-card/RoomCard";
import CardWrapper from "@/components/info-cards/wrapper/CardWrapper";
import useLocationParams from "@/hooks/useLocationParams";

import BuildingCard from "../building-card/BuildingCard";

interface Props {
  map: mapkit.Map | null;
}

const InfoCard = ({ map }: Props) => {
  const { buildingCode, roomName } = useLocationParams();

  const renderCard = () => {
    if (roomName) {
      return <RoomCard />;
    } else if (buildingCode) {
      return <BuildingCard map={map} />;
    } else {
      return <></>;
    }
  };

  return <CardWrapper>{renderCard()}</CardWrapper>;
};

export default InfoCard;
