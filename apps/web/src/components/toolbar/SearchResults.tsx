import Event from "@/components/carnival/events/displays/Event";
import { useSearchQuery } from "@/store/features/api/apiSlice";
import { useAppSelector } from "@/store/hooks";

interface Props {
  mapRef: React.RefObject<mapkit.Map | null>;
  searchQuery: string;
}

const SearchResults = ({ mapRef, searchQuery }: Props) => {
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
        return <Event key={event.id} mapRef={mapRef} event={event} />;
      })}
    </div>
  );
};

export default SearchResults;
