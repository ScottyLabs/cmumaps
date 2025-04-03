import { Annotation } from "mapkit-react";

import { useNavigate } from "react-router";

import boothPin from "@/assets/carnival/icons/booth-default.svg";

const coords = {
  latitude: 40.44178556205064,
  longitude: -79.94214696773744,
};

const BoothPin = () => {
  const navigate = useNavigate();

  return (
    <Annotation
      latitude={coords.latitude}
      longitude={coords.longitude}
      displayPriority="required"
      onSelect={() => navigate("/carnival/booth")}
    >
      <img
        src={boothPin}
        alt="Booth Pin"
        className="h-10 w-10 cursor-pointer"
      />
    </Annotation>
  );
};

export default BoothPin;
