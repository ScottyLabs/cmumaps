import filterSvg from "@/assets/carnival/icons/filter.svg";

const EventsFilter = () => {
  const filterTypes = ["Registration", "Fee", "Limited"];

  return (
    <div className="flex items-center gap-3">
      <button className="flex items-center rounded-sm bg-red-600 p-1 text-white">
        <img src={filterSvg} alt="filter" className="h-4 w-4" />
        <span className="ml-1 text-left text-xs">Select Event Type</span>
      </button>

      <div className="flex gap-3">
        {filterTypes.map((filterType) => (
          <label key={filterType} className="flex cursor-pointer items-center">
            <input type="checkbox" />
            <p className="ml-1 text-sm"> {filterType}</p>
          </label>
        ))}
      </div>
    </div>
  );
};

export default EventsFilter;
