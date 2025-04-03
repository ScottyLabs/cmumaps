import {
  CarnivalDate,
  carnivalDates,
} from "@/components/carnival/events/utils/timeUtils";

interface Props {
  selectedDate: CarnivalDate;
  setSelectedDate: (date: CarnivalDate) => void;
}

const EventsDatePicker = ({ selectedDate, setSelectedDate }: Props) => {
  const dayOfWeek = ["All Dates", "Thursday", "Friday", "Saturday"];

  return (
    <div className="flex gap-2">
      {carnivalDates.map((date, index) => (
        <button
          key={index}
          className={`flex-1 cursor-pointer rounded-lg py-2 text-center ${selectedDate === date ? "bg-red-700 text-white" : "bg-gray-200"}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className="text-sm font-bold">{dayOfWeek[index]}</div>
          <div className="text-sm">{date}</div>
        </button>
      ))}
    </div>
  );
};

export default EventsDatePicker;
