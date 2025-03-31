import { useRef } from "react";

import FloorSwitcher from "@/components/floor-switcher/FloorSwitcher";
import LoginModal from "@/components/login/LoginModal";
import MapDisplay from "@/components/map-display/MapDisplay";
import Toolbar from "@/components/toolbar/Toolbar";
import IconsDisplay from "@/components/ui-layout/IconsDisplay";
import MyToastContainer from "@/components/ui-layout/MyToastContainer";

const App = () => {
  const mapRef = useRef<mapkit.Map | null>(null);

  return (
    <main className="relative h-screen">
      <MapDisplay mapRef={mapRef} />
      <LoginModal />
      <IconsDisplay />
      <Toolbar map={mapRef.current} />
      <FloorSwitcher />
      <MyToastContainer />
    </main>
  );
};

export default App;
