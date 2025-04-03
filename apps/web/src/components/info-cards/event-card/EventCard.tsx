import InfoCardImage from "@/components/info-cards/shared/media/InfoCardImage";

interface Props {
  eventId: string;
}

const EventCard = ({ eventId }: Props) => {
  return (
    <div>
      <InfoCardImage
        url={"/imgs/carnival/default.png"}
        alt={"Spring Carnival Image"}
      />
      {eventId}
    </div>
  );
};

export default EventCard;
