import { Annotation } from "mapkit-react";

import { useNavigate } from "react-router";

import boothPin from "@/assets/carnival/icons/booth-default.svg";
import { pinOffsetY, pinSize } from "@/components/map-display/events/EventPin";
import useLocationParams from "@/hooks/useLocationParams";

const coords = {
  latitude: 40.44178556205064,
  longitude: -79.94214696773744,
};

const BoothPin = () => {
  const navigate = useNavigate();
  const { carnivalEvent } = useLocationParams();
  const selected = carnivalEvent === "booth";

  return (
    <Annotation
      latitude={coords.latitude}
      longitude={coords.longitude}
      displayPriority="required"
      anchorOffsetY={selected ? pinOffsetY.selected : pinOffsetY.default}
      size={selected ? pinSize.selected : pinSize.default}
      selected={selected}
      onSelect={() => navigate("/carnival/booth")}
    >
      <img
        src={boothPin}
        alt="Booth Pin"
        className="cursor-pointer"
        onClick={(e) => e.stopPropagation()}
      />
    </Annotation>
  );
};

export default BoothPin;
