import { useSearchParams } from "react-router";

import useWebSocket from "../../hooks/useWebSocket";
import InfoDisplay from "../info-display/InfoDisplay";
import ZoomPanWrapper from "../zoom-pan/ZoomPanWrapper";

interface Props {
  floorCode: string;
}

const MainDisplay = ({ floorCode }: Props) => {
  const [searchParam] = useSearchParams();
  const nodeIdSelected = searchParam.get("nodeId");

  useWebSocket(floorCode);

  return (
    <>
      <div className="fixed top-1/2 z-50 -translate-y-1/2">
        {/* <SidePanel floorCode={floorCode} /> */}
      </div>
      <ZoomPanWrapper floorCode={floorCode} />
      {nodeIdSelected && (
        <div className="absolute top-28 right-4 z-50">
          <InfoDisplay floorCode={floorCode} />
        </div>
      )}
    </>
  );
};

export default MainDisplay;
