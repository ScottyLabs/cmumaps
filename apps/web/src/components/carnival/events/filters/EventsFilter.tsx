import filterSvg from "@/assets/carnival/icons/filter.svg";

import EventsTypesDropdown from "./EventsTypesDropdown";

interface Props {
  isDropdownOpen: boolean;
  setIsDropdownOpen: (isDropdownOpen: boolean) => void;
  selectedTypes: string[];
  setSelectedTypes: (selectedTypes: string[]) => void;
  selectedReqs: string[];
  setSelectedReqs: (selectedReqs: string[]) => void;
}

const EventsFilter = ({
  isDropdownOpen,
  setIsDropdownOpen,
  selectedTypes,
  setSelectedTypes,
  selectedReqs,
  setSelectedReqs,
}: Props) => {
  const filterTypes = ["Registration", "Fee", "Limited"];

  const renderDropdown = () => {
    return (
      isDropdownOpen && (
        <div className="relative">
          <div className="absolute top-6 left-0">
            <EventsTypesDropdown
              selectedTypes={selectedTypes}
              setSelectedTypes={setSelectedTypes}
            />
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
    const handleChange = (filterType: string) => {
      if (selectedReqs.includes(filterType)) {
        setSelectedReqs(selectedReqs.filter((req) => req !== filterType));
      } else {
        setSelectedReqs([...selectedReqs, filterType]);
      }
    };

    return (
      <div className="flex gap-3">
        {filterTypes.map((filterType) => (
          <div
            key={filterType}
            className="flex cursor-pointer items-center"
            onClick={(e) => {
              e.stopPropagation();
              handleChange(filterType);
            }}
          >
            <input
              type="checkbox"
              className="cursor-pointer"
              checked={selectedReqs.includes(filterType)}
              readOnly
            />
            <p className="ml-1 text-sm"> {filterType}</p>
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
