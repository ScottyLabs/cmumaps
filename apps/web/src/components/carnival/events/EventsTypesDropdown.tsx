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
    <div className="mt-2 w-full rounded-md border border-gray-200 bg-white shadow-lg">
      {eventTypes.map((eventType, index) => (
        <div
          key={index}
          className={`flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50 ${
            index !== eventTypes.length - 1 ? "border-b border-gray-200" : ""
          }`}
        >
          <span>{eventType}</span>
          <div className="h-6 w-6 rounded border border-gray-300"></div>
        </div>
      ))}
    </div>
  );
};

export default EventsTypesDropdown;
