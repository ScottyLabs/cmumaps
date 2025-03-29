import LoginModal from "@/components/login/LoginModal";
import MapDisplay from "@/components/map-display/MapDisplay";

const App = () => {
  return (
    <main className="relative h-screen">
      <MapDisplay />
      <LoginModal />
    </main>
  );
};

export default App;
