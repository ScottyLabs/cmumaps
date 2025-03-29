import InfoCard from "@/components/info-cards/InfoCard";
import FloorSwitcher from "@/components/toolbar/FloorSwitcher";
import SearchInput from "@/components/toolbar/SearchInput";
import useIsMobile from "@/hooks/useIsMobile";
import useLocationParams from "@/hooks/useLocationParams";

interface Props {
  map: mapkit.Map | null;
}

const Toolbar = ({ map }: Props) => {
  const isMobile = useIsMobile();
  const { isCardOpen } = useLocationParams();

  const mobileRender = () => {
    const bottomClass = isCardOpen ? "bottom-2" : "bottom-10";

    return (
      <>
        <div
          style={{ maxHeight: `calc(100vh)` }}
          className="fixed flex w-full px-2"
        >
          <div className="flex w-full flex-col space-y-2 overflow-hidden py-2">
            <SearchInput />
            <InfoCard map={map} />
          </div>
        </div>
        <div
          className={`fixed bottom-2 left-1/2 w-fit -translate-x-1/2 px-2 ${bottomClass}`}
        >
          <FloorSwitcher />
        </div>
      </>
    );
  };

  const desktopRender = () => {
    // need box content so the width of the search bar match the card
    return (
      <>
        <div
          style={{ maxHeight: `calc(100vh)` }}
          className="fixed top-2 left-2 box-content flex w-96"
        >
          <div className="flex w-full flex-col space-y-2 overflow-hidden">
            <SearchInput />
            <InfoCard map={map} />
          </div>
        </div>
        <div className="fixed bottom-2 left-1/2 w-fit -translate-x-1/2 px-2">
          <FloorSwitcher />
        </div>
      </>
    );
  };

  return (
    <div className="absolute z-10">
      {isMobile ? mobileRender() : desktopRender()}
    </div>
  );
};

export default Toolbar;
