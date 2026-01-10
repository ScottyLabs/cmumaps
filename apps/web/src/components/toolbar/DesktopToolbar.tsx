import { InfoCard } from "@/components/info-cards/wrapper/InfoCard.tsx";
import { Searchbar } from "@/components/toolbar/Searchbar.tsx";

interface Props {
  mapRef: React.RefObject<mapkit.Map | null>;
}

const DesktopToolbar = ({ mapRef }: Props) => (
  <div
    style={{ maxHeight: "calc(100dvh - 2.5rem)" }}
    className="fixed top-2 left-2 box-content flex w-96"
  >
    <div className="flex w-full flex-col overflow-hidden">
      <Searchbar mapRef={mapRef} />
      <InfoCard mapRef={mapRef} />
    </div>
  </div>
);

export { DesktopToolbar };
