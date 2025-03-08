import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import useValidatedFloorParams from "../../hooks/useValidatedFloorParams";
import useWebSocket from "../../hooks/useWebSocket";
import InfoDisplay from "../info-display/InfoDisplay";
import ZoomPanWrapper from "../zoom-pan/ZoomPanWrapper";

interface Props {
  floorCode: string;
}

const MainDisplay = ({ floorCode }: Props) => {
  const navigate = useNavigate();
  useWebSocket(floorCode);

  const { error } = useValidatedFloorParams(floorCode);

  useEffect(() => {
    if (error) {
      toast.error(error);
      navigate("?");
    }
  }, [error, navigate]);

  if (error) {
    return;
  }

  return (
    <>
      <div className="fixed top-1/2 z-50 -translate-y-1/2">
        {/* <SidePanel floorCode={floorCode} /> */}
      </div>
      <ZoomPanWrapper floorCode={floorCode} />
      <div className="absolute top-28 right-4 z-50">
        <InfoDisplay floorCode={floorCode} />
      </div>
    </>
  );
};

export default MainDisplay;
