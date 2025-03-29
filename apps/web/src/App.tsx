import { useRef } from "react";

import LoginModal from "@/components/login/LoginModal";
import MapDisplay from "@/components/map-display/MapDisplay";
import Toolbar from "@/components/toolbar/Toolbar";
import IconsDisplay from "@/components/ui-layout/IconsDisplay";

const App = () => {
  const mapRef = useRef<mapkit.Map | null>(null);

  return (
    <main className="relative h-screen">
      <MapDisplay mapRef={mapRef} />
      <LoginModal />
      <IconsDisplay />
      <Toolbar map={mapRef.current} />
    </main>
  );
};

export default App;
