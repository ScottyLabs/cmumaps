import Events from "@/components/carnival/events/Events";
import InfoCard from "@/components/info-cards/wrapper/InfoCard";
import Searchbar from "@/components/toolbar/Searchbar";

interface Props {
  map: mapkit.Map | null;
}

const MobileToolbar = ({ map }: Props) => {
  return (
    <>
      <div
        style={{ maxHeight: `calc(100dvh - 0.5rem)` }}
        className="fixed top-2 flex w-full px-2"
      >
        <div className="flex w-full flex-col overflow-hidden py-2">
          <Searchbar map={map} />
          <Events map={map} />
        </div>
      </div>
      <div className="fixed w-full">
        <InfoCard map={map} />
      </div>
    </>
  );
};

export default MobileToolbar;
