import { Annotation } from "mapkit-react";

import { useNavigate } from "react-router";

import buggyPin from "@/assets/carnival/icons/buggy-default.svg";

const coords = {
  latitude: 40.4399256074742,
  longitude: -79.94221927918477,
};

const BuggyPin = () => {
  const navigate = useNavigate();

  return (
    <Annotation
      latitude={coords.latitude}
      longitude={coords.longitude}
      displayPriority="required"
      onSelect={() => navigate("/carnival/buggy")}
    >
      <img
        src={buggyPin}
        alt="Buggy Pin"
        className="h-10 w-10 cursor-pointer"
      />
    </Annotation>
  );
};

export default BuggyPin;
