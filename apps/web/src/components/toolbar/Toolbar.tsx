import Events from "@/components/carnival/Events";
import InfoCard from "@/components/info-cards/wrapper/InfoCard";
import SearchInput from "@/components/toolbar/SearchInput";
import ToolbarWrapper from "@/components/toolbar/ToolbarWrapper";

interface Props {
  map: mapkit.Map | null;
}

const Toolbar = ({ map }: Props) => {
  return (
    <ToolbarWrapper>
      <SearchInput />
      <InfoCard map={map} />
      <Events />
    </ToolbarWrapper>
  );
};

export default Toolbar;
