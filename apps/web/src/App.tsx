import { useUser } from "@clerk/clerk-react";
import { usePostHog } from "posthog-js/react";

import { useEffect, useRef } from "react";

import FloorSwitcher from "@/components/floor-switcher/FloorSwitcher";
import LoginModal from "@/components/login/LoginModal";
import MapDisplay from "@/components/map-display/MapDisplay";
import Toolbar from "@/components/toolbar/Toolbar";
import IconsDisplay from "@/components/ui-layout/IconsDisplay";
import MyToastContainer from "@/components/ui-layout/MyToastContainer";

const App = () => {
  const mapRef = useRef<mapkit.Map | null>(null);

  // Identify posthog user with Clerk id
  const { user } = useUser();
  const posthog = usePostHog();
  useEffect(() => {
    if (user) {
      posthog?.identify(user.id);
    } else {
      posthog?.reset();
    }
  }, [posthog, user]);

  return (
    <main className="relative h-dvh">
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
