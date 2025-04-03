interface Props {
  selectedTypes: string[];
  setSelectedTypes: (selectedTypes: string[]) => void;
}

const eventTypes = [
  "CMU Tradition",
  "Food",
  "Awards/Celebration",
  "Exhibit/Tour",
  "Health/Wellness",
  "Alumni",
  "Performance",
];

const EventsTypesDropdown = ({ selectedTypes, setSelectedTypes }: Props) => {
  const handleChange = (eventType: string) => {
    if (selectedTypes.includes(eventType)) {
      setSelectedTypes(selectedTypes.filter((type) => type !== eventType));
    } else {
      setSelectedTypes([...selectedTypes, eventType]);
    }
  };

  return (
    <div className="z-10 w-full rounded-md border border-gray-200 bg-white shadow-lg">
      {eventTypes.map((eventType, index) => (
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
            checked={selectedTypes.includes(eventType)}
            readOnly
          />
        </div>
      ))}
    </div>
  );
};

export default EventsTypesDropdown;
