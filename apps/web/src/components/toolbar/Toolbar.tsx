import FloorSwitcher from "@/components/toolbar/FloorSwitcher";
import useIsMobile from "@/hooks/useIsMobile";
import useLocationParams from "@/hooks/useLocationParams";

const Toolbar = () => {
  const isMobile = useIsMobile();
  const { isCardOpen } = useLocationParams();

  const mobileRender = () => {
    const bottomClass = isCardOpen ? "bottom-2" : "bottom-10";

    return (
      <div
        style={{ maxHeight: `calc(100vh)` }}
        className="fixed flex w-full px-2"
      >
        <div className="flex w-full flex-col space-y-2 overflow-hidden py-2">
          {/* <SearchBar map={map} />
          <InfoCard map={map} /> */}
        </div>
        <div
          className={`fixed bottom-2 left-1/2 w-fit -translate-x-1/2 px-2 ${bottomClass}`}
        >
          <FloorSwitcher />
        </div>
      </div>
    );
  };

  const desktopRender = () => {
    // need box content so the width of the search bar match the card
    return (
      <>
        <div
          style={{ maxHeight: `calc(100vh)` }}
          className="fixed box-content flex w-96 px-2"
        >
          <div className="flex w-full flex-col space-y-2 overflow-hidden py-2">
            {/* <SearchBar map={map} />
            <InfoCard map={map} /> */}
          </div>
          <div className="fixed bottom-2 left-1/2 w-fit -translate-x-1/2 px-2">
            <FloorSwitcher />
          </div>
        </div>
      </>
    );
  };

  return isMobile ? mobileRender() : desktopRender();
};

export default Toolbar;
