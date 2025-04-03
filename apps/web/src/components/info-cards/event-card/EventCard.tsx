import InfoCardImage from "@/components/info-cards/shared/media/InfoCardImage";
import { useGetEventQuery } from "@/store/features/api/eventApiSlice";

interface Props {
  eventId: string;
}

const EventCard = ({ eventId }: Props) => {
  const { data } = useGetEventQuery(eventId);
  console.log(data);

  return (
    <div className="flex flex-col">
      <InfoCardImage
        url={"/imgs/carnival/default.png"}
        alt={"Spring Carnival Image"}
      />
      {eventId}
    </div>
  );
};

export default EventCard;
