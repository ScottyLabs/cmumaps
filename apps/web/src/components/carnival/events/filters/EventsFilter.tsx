import filterSvg from "@/assets/carnival/icons/filter.svg";
import { eventReqs, setSelectedReqs } from "@/store/features/eventSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import EventsTracksDropdown from "./EventsTracksDropdown";

interface Props {
  isDropdownOpen: boolean;
  setIsDropdownOpen: (isDropdownOpen: boolean) => void;
}

const EventsFilter = ({ isDropdownOpen, setIsDropdownOpen }: Props) => {
  const dispatch = useAppDispatch();
  const selectedReqs = useAppSelector((state) => state.event.selectedReqs);

  const renderDropdown = () => {
    return (
      isDropdownOpen && (
        <div className="relative">
          <div className="absolute top-6 left-0">
            <EventsTracksDropdown />
          </div>
        </div>
      )
    );
  };

  const renderTypesFilter = () => {
    return (
      <button
        className="flex cursor-pointer items-center rounded-lg bg-red-700 p-1 py-2 text-white"
        onClick={(e) => {
          e.stopPropagation();
          setIsDropdownOpen(!isDropdownOpen);
        }}
      >
        <img src={filterSvg} alt="filter" className="h-4 w-4" />
        <span className="ml-1 text-left text-xs">Select Event Type</span>
      </button>
    );
  };

  const renderRequirementsFilter = () => {
    const handleChange = (req: string) => {
      if (selectedReqs.includes(req)) {
        dispatch(
          setSelectedReqs(selectedReqs.filter((curReq) => curReq !== req)),
        );
      } else {
        dispatch(setSelectedReqs([...selectedReqs, req]));
      }
    };

    return (
      <div className="flex gap-3">
        {eventReqs.map((req) => (
          <div
            key={req}
            className="flex cursor-pointer items-center"
            onClick={(e) => {
              e.stopPropagation();
              handleChange(req);
            }}
          >
            <input
              type="checkbox"
              className="cursor-pointer"
              checked={selectedReqs.includes(req)}
              readOnly
            />
            <p className="ml-1 text-sm"> {req}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div>
        {renderDropdown()}
        <div className="flex items-center gap-3">
          {renderTypesFilter()}
          {renderRequirementsFilter()}
        </div>
      </div>
    </>
  );
};

export default EventsFilter;
