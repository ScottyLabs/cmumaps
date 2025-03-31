import Events from "@/components/carnival/events/Events";
import InfiniteScrollWrapper from "@/components/carnival/events/displays/InfiniteScrollWrapper";
import InfoCard from "@/components/info-cards/wrapper/InfoCard";
import SearchInput from "@/components/toolbar/SearchInput";
import ToolbarWrapper from "@/components/toolbar/ToolbarWrapper";

interface Props {
  map: mapkit.Map | null;
}

const Toolbar = ({ map }: Props) => {
  return (
    <ToolbarWrapper>
      {/* <SearchInput />
      <InfoCard map={map} />
      <Events /> */}
      <InfiniteScrollWrapper />
    </ToolbarWrapper>
  );
};

export default Toolbar;
