import { useEffect } from "react";

import EventInfo from "@/components/carnival/events/displays/EventInfo";
import InfoCardImage from "@/components/info-cards/shared/media/InfoCardImage";
import { useGetEventQuery } from "@/store/features/api/eventApiSlice";
import { setSnapPoints } from "@/store/features/cardSlice";
import { useAppDispatch } from "@/store/hooks";

interface Props {
  eventId: string;
}

const EventCard = ({ eventId }: Props) => {
  const dispatch = useAppDispatch();
  const { data } = useGetEventQuery(eventId);

  useEffect(() => {
    dispatch(setSnapPoints([142, 350, screen.availHeight]));
  }, [dispatch]);

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
