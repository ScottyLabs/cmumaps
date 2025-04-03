import EventInfo from "@/components/carnival/events/displays/EventInfo";
import InfoCardImage from "@/components/info-cards/shared/media/InfoCardImage";
import { useGetEventQuery } from "@/store/features/api/eventApiSlice";

interface Props {
  eventId: string;
}

const EventCard = ({ eventId }: Props) => {
  const { data } = useGetEventQuery(eventId);

  if (!data) {
    return <></>;
  }

  return (
    <div className="flex flex-col">
      <InfoCardImage
        url={"/imgs/carnival/default.png"}
        alt={"Spring Carnival Image"}
      />
      <div className="mt-2 space-y-2 bg-white p-3 text-sm">
        <EventInfo event={data.event} />
        <div className="h-2 w-full bg-gray-200" />
        <div dangerouslySetInnerHTML={{ __html: data.event.description }} />
      </div>
    </div>
  );
};

export default EventCard;
