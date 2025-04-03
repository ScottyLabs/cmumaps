import Events from "@/components/carnival/events/Events";
import InfoCard from "@/components/info-cards/wrapper/InfoCard";
import SearchInput from "@/components/toolbar/SearchInput";

interface Props {
  map: mapkit.Map | null;
}

const DesktopToolbar = ({ map }: Props) => {
  return (
    <div
      style={{ maxHeight: `calc(100vh - 2.5rem)` }}
      className="fixed top-2 left-2 box-content flex w-96"
    >
      <div className="flex w-full flex-col overflow-hidden">
        <SearchInput />
        <InfoCard map={map} />
        <Events />
      </div>
    </div>
  );
};

export default DesktopToolbar;
