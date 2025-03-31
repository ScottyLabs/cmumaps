interface Props {
  activeDate: string;
  setActiveDate: (date: string) => void;
}

const EventsDatePicker = ({ activeDate, setActiveDate }: Props) => {
  const dayOfWeek = ["All Dates", "Thursday", "Friday", "Saturday"];
  const dates = ["3/28-4/6", "4/3", "4/4", "4/5"];

  return (
    <div className="flex gap-2">
      {dayOfWeek.map((day, index) => (
        <button
          key={index}
          className={`flex-1 rounded-lg py-2 text-center ${activeDate === day ? "bg-red-600 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveDate(day)}
        >
          <div className="text-sm font-bold">{day}</div>
          <div className="text-sm">{dates[index]}</div>
        </button>
      ))}
    </div>
  );
};

export default EventsDatePicker;
