const eventTypes = [
  "Alumni",
  "Booth/Dog House",
  "Buggy",
  "Mobot",
  "Performance",
  "Tent",
  "Awards/Celebration",
  "Exhibit/Tour",
  "CMU Tradition",
  "Open House",
];

const EventsTypesDropdown = () => {
  return (
    <div className="w-full rounded-md border border-gray-200 bg-white shadow-lg">
      {eventTypes.map((eventType, index) => (
        <div
          key={index}
          className="flex cursor-pointer items-center justify-between gap-3 border-b border-gray-200 p-3 hover:bg-gray-50"
        >
          <span>{eventType}</span>
          <input type="checkbox" className="cursor-pointer" />
        </div>
      ))}
    </div>
  );
};

export default EventsTypesDropdown;
