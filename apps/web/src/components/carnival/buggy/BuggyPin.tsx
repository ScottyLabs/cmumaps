import { Annotation } from "mapkit-react";

import { useNavigate } from "react-router";

import buggyPin from "@/assets/carnival/icons/buggy-default.svg";
import { pinOffsetY, pinSize } from "@/components/map-display/events/EventPin";
import useLocationParams from "@/hooks/useLocationParams";

const coords = {
  latitude: 40.4401409286339,
  longitude: -79.9422691451432,
};

const BuggyPin = () => {
  const navigate = useNavigate();
  const { carnivalEvent } = useLocationParams();
  const selected = carnivalEvent === "buggy";

  return (
    <Annotation
      latitude={coords.latitude}
      longitude={coords.longitude}
      displayPriority="required"
      anchorOffsetY={selected ? pinOffsetY.selected : pinOffsetY.default}
      size={selected ? pinSize.selected : pinSize.default}
      selected={selected}
      onSelect={() => navigate("/carnival/buggy")}
    >
      <img
        src={buggyPin}
        alt="Buggy Pin"
        className="cursor-pointer"
        onClick={(e) => e.stopPropagation()}
      />
    </Annotation>
  );
};

export default BuggyPin;
