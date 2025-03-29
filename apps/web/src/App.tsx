import MapDisplay from "@/components/map-display/MapDisplay";
import useIsMobile from "@/hooks/useIsMobile";

const App = () => {
  const isMobile = useIsMobile();
  console.log(isMobile);

  return (
    <main className="relative h-screen">
      <MapDisplay />
    </main>
  );
};

export default App;
