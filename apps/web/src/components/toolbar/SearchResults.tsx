import useBoundStore from "@/store";

interface Props {
  mapRef: React.RefObject<mapkit.Map | null>;
  searchQuery: string;
}

const SearchResults = ({ searchQuery }: Props) => {
  // Global state
  const isSearchOpen = useBoundStore((state) => state.isSearchOpen);

  // Don't render if the search is not open or the search query is empty
  if (searchQuery.length === 0 || !isSearchOpen) {
    return <></>;
  }

  // No results found
  return (
    <div className="flex h-32 flex-col items-center justify-center bg-white p-2 text-lg">
      No results found
    </div>
  );

  // TODO: Render results
};

export default SearchResults;
