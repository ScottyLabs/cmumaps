import { useDispatch } from "react-redux";

import { eventTracks, setSelectedTracks } from "@/store/features/eventSlice";
import { useAppSelector } from "@/store/hooks";

const EventsTracksDropdown = () => {
  const dispatch = useDispatch();
  const selectedTracks = useAppSelector((state) => state.event.selectedTracks);

  const handleChange = (eventType: string) => {
    if (selectedTracks.includes(eventType)) {
      dispatch(
        setSelectedTracks(selectedTracks.filter((type) => type !== eventType)),
      );
    } else {
      dispatch(setSelectedTracks([...selectedTracks, eventType]));
    }
  };

  return (
    <div className="z-10 w-full rounded-md border border-gray-200 bg-white shadow-lg">
      {eventTracks.map((eventType, index) => (
        <div
          key={index}
          className="flex cursor-pointer items-center justify-between gap-3 border-b border-gray-200 p-3 hover:bg-gray-50"
          onClick={(e) => {
            e.stopPropagation();
            handleChange(eventType);
          }}
        >
          <span>{eventType}</span>
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={selectedTracks.includes(eventType)}
            readOnly
          />
        </div>
      ))}
    </div>
  );
};

export default EventsTracksDropdown;
