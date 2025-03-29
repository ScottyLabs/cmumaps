import LoginModal from "@/components/login/LoginModal";
import MapDisplay from "@/components/map-display/MapDisplay";
import Toolbar from "@/components/toolbar/Toolbar";
import IconsDisplay from "@/components/ui-layout/IconsDisplay";

const App = () => {
  return (
    <main className="relative h-screen">
      <MapDisplay />
      <LoginModal />
      <IconsDisplay />
      <Toolbar />
    </main>
  );
};

export default App;
