import { EventType } from "@cmumaps/common";

import { useNavigate } from "react-router";

import { setIsSearchOpen } from "@/store/features/uiSlice";
import { useAppDispatch } from "@/store/hooks";
import { zoomOnPoint } from "@/utils/zoomUtils";

interface Props {
  mapRef: React.RefObject<mapkit.Map | null>;
  event: EventType;
}

const EventBody = ({ event, mapRef }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <div className="mt-2 space-y-2 bg-white p-3 text-sm">
      <div dangerouslySetInnerHTML={{ __html: event.description }} />
      <div className="flex justify-end">
        <button
          className="cursor-pointer rounded-lg border-2 bg-blue-500 p-1 text-white"
          onClick={() => {
            if (mapRef.current && event.latitude && event.longitude) {
              zoomOnPoint(mapRef.current, {
                latitude: event.latitude,
                longitude: event.longitude,
              });
            }
            dispatch(setIsSearchOpen(false));
            navigate(`/events/${event.id}`);
          }}
        >
          View on map
        </button>
      </div>
    </div>
  );
};

export default EventBody;
