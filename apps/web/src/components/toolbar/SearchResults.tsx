import { useSearchQuery } from "@/store/features/api/apiSlice";

interface Props {
  searchQuery: string;
}

const SearchResults = ({ searchQuery }: Props) => {
  const { data } = useSearchQuery(searchQuery);

  if (!data) {
    return <></>;
  }

  console.log(data);

  return <div>SearchResults</div>;
};

export default SearchResults;
