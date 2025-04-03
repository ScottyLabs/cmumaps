import Events from "@/components/carnival/events/Events";
import InfoCard from "@/components/info-cards/wrapper/InfoCard";
import Searchbar from "@/components/toolbar/Searchbar";

interface Props {
  map: mapkit.Map | null;
}

const Toolbar = ({ map }: Props) => {
  return (
    <>
      <div
        style={{ maxHeight: `calc(100vh - 0.5rem)` }}
        className="fixed top-2 flex w-full px-2"
      >
        <div className="flex w-full flex-col overflow-hidden py-2">
          <Searchbar />
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
