interface Props {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const EventsDatePicker = ({ selectedDate, setSelectedDate }: Props) => {
  const dayOfWeek = ["All Dates", "Thursday", "Friday", "Saturday"];
  const dates = ["3/28-4/6", "4/3", "4/4", "4/5"];

  return (
    <div className="flex gap-2">
      {dates.map((date, index) => (
        <button
          key={index}
          className={`flex-1 cursor-pointer rounded-lg py-2 text-center ${selectedDate === date ? "bg-red-600 text-white" : "bg-gray-200"}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className="text-sm font-bold">{dayOfWeek[index]}</div>
          <div className="text-sm">{dates[index]}</div>
        </button>
      ))}
    </div>
  );
};

export default EventsDatePicker;
