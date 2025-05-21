import { useAppSelector } from "@/store/hooks";

interface Props {
  mapRef: React.RefObject<mapkit.Map | null>;
  searchQuery: string;
}

const SearchResults = ({ searchQuery }: Props) => {
  const isSearchOpen = useAppSelector((state) => state.ui.isSearchOpen);

  if (searchQuery.length === 0 || !isSearchOpen) {
    return <></>;
  }

  return (
    <div className="flex h-32 flex-col items-center justify-center bg-white p-2 text-lg">
      No results found
    </div>
  );
};

export default SearchResults;
