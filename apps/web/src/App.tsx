import { usePostHog } from "posthog-js/react";
import { useEffect, useRef } from "react";
import FloorSwitcher from "@/components/floor-switcher/FloorSwitcher";
import LoginModal from "@/components/login/LoginModal";
import MapDisplay from "@/components/map-display/MapDisplay";
import Toolbar from "@/components/toolbar/Toolbar";
import IconsDisplay from "@/components/ui-layout/icons-display/IconsDisplay";
import MyToastContainer from "@/components/ui-layout/MyToastContainer";
import useUser from "@/hooks/useUser";
import NavOverlay from "./components/nav/NavOverlay.tsx";

const App = () => {
  const mapRef = useRef<mapkit.Map | null>(null);

  // Identify PostHog user with user ID
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
      <NavOverlay />
      <Toolbar mapRef={mapRef} />
      <FloorSwitcher />
      <MyToastContainer />
    </main>
  );
};

export default App;
