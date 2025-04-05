import Event from "@/components/carnival/events/displays/Event";
import { useSearchQuery } from "@/store/features/api/apiSlice";
import { useAppSelector } from "@/store/hooks";

interface Props {
  searchQuery: string;
}

const SearchResults = ({ searchQuery }: Props) => {
  const { data } = useSearchQuery(searchQuery);
  const isSearchOpen = useAppSelector((state) => state.ui.isSearchOpen);

  if (!data || searchQuery.length === 0 || !isSearchOpen) {
    return <></>;
  }

  if (data.length === 0) {
    return (
      <div className="flex h-32 flex-col items-center justify-center bg-white p-2 text-lg">
        No results found
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-auto bg-white p-2">
      {data.map((event) => {
        const fixedEvent = {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          id: event.eventId,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          name: event.title,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          startTime: event.startDateTime,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          endTime: event.endDateTime,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          location: event.locationName,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          description: event.description,
        };

        return <Event key={fixedEvent.id} event={fixedEvent} />;
      })}
    </div>
  );
};

export default SearchResults;
