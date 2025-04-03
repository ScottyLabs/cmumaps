import CarnivalCard from "@/components/info-cards/event-card/CarnivalCard";
import EventCard from "@/components/info-cards/event-card/EventCard";
import RoomCard from "@/components/info-cards/room-card/RoomCard";
import CardWrapper from "@/components/info-cards/wrapper/CardWrapper";
import useLocationParams from "@/hooks/useLocationParams";
import { useAppSelector } from "@/store/hooks";

import BuildingCard from "../building-card/BuildingCard";

interface Props {
  map: mapkit.Map | null;
}

const InfoCard = ({ map }: Props) => {
  const { buildingCode, roomName, eventId, carnivalEvent } =
    useLocationParams();

  const isSearchOpen = useAppSelector((state) => state.ui.isSearchOpen);
  if (isSearchOpen) {
    return <></>;
  }

  const renderCard = () => {
    if (roomName) {
      return <RoomCard />;
    } else if (buildingCode) {
      return <BuildingCard map={map} />;
    } else if (eventId) {
      return <EventCard eventId={eventId} />;
    } else if (carnivalEvent) {
      return <CarnivalCard carnivalEvent={carnivalEvent} />;
    } else {
      return <></>;
    }
  };

  return <CardWrapper>{renderCard()}</CardWrapper>;
};

export default InfoCard;
