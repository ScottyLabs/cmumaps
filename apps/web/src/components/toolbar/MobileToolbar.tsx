import Events from "@/components/carnival/events/Events";
import InfoCard from "@/components/info-cards/wrapper/InfoCard";
import SearchInput from "@/components/toolbar/SearchInput";

interface Props {
  map: mapkit.Map | null;
}

const Toolbar = ({ map }: Props) => {
  return (
    <>
      <div
        style={{ maxHeight: `calc(100vh)` }}
        className="fixed top-2 flex w-full px-2"
      >
        <div className="flex w-full flex-col overflow-hidden py-2">
          <SearchInput />
          <Events />
        </div>
      </div>
      <div className="fixed w-full">
        <InfoCard map={map} />
      </div>
    </>
  );
};

export default Toolbar;
