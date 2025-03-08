import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import useValidatedFloorParams from "../../hooks/useValidatedFloorParams";
import useWebSocket from "../../hooks/useWebSocket";
import {
  useGetFloorGraphQuery,
  useGetFloorPoisQuery,
  useGetFloorRoomsQuery,
} from "../../store/api/floorDataApiSlice";
import InfoDisplay from "../info-display/InfoDisplay";
import ErrorDisplay from "../shared/ErrorDisplay";
import Loader from "../shared/Loader";
import SidePanel from "../side-panel/SidePanel";
import ZoomPanWrapper from "../zoom-pan/ZoomPanWrapper";

interface Props {
  floorCode: string;
}

const MainDisplay = ({ floorCode }: Props) => {
  const navigate = useNavigate();
  useWebSocket(floorCode);

  // handles invalid nodeId or roomId
  const { error } = useValidatedFloorParams(floorCode);
  useEffect(() => {
    if (error) {
      toast.error(error);
      navigate("?");
    }
  }, [error, navigate]);

  // fetch graph, rooms, and pois
  const {
    data: graph,
    isFetching: isFetchingGraph,
    isError: isErrorGraph,
  } = useGetFloorGraphQuery(floorCode);
  const {
    data: rooms,
    isFetching: isFetchingRooms,
    isError: isErrorRooms,
  } = useGetFloorRoomsQuery(floorCode);
  const {
    data: pois,
    isFetching: isFetchingPois,
    isError: isErrorPois,
  } = useGetFloorPoisQuery(floorCode);

  if (error) {
    return;
  }

  // we need this for the flicker effect when refetching
  if (isFetchingGraph || isFetchingRooms || isFetchingPois) {
    return <Loader loadingText="Fetching nodes, rooms, and pois" />;
  }

  // handle errors
  const isError = isErrorGraph || isErrorRooms || isErrorPois;
  if (isError || !graph || !rooms || !pois) {
    return <ErrorDisplay errorText="Failed to fetch nodes, rooms, and pois" />;
  }

  return (
    <>
      <div className="fixed top-1/2 z-50 -translate-y-1/2">
        <SidePanel floorCode={floorCode} graph={graph} rooms={rooms} />
      </div>
      <ZoomPanWrapper
        floorCode={floorCode}
        graph={graph}
        rooms={rooms}
        pois={pois}
      />
      <div className="absolute top-28 right-4 z-50">
        <InfoDisplay
          floorCode={floorCode}
          graph={graph}
          rooms={rooms}
          pois={pois}
        />
      </div>
    </>
  );
};

export default MainDisplay;
