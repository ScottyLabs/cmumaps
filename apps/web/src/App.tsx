import LoginModal from "@/components/login/LoginModal";
import MapDisplay from "@/components/map-display/MapDisplay";
import IconsDisplay from "@/components/ui-layout/IconsDisplay";

const App = () => {
  return (
    <main className="relative h-screen">
      <MapDisplay />
      <LoginModal />
      <IconsDisplay />
    </main>
  );
};

export default App;
