import React from "react";

import { Graph, Pois, Rooms } from "../../../../shared/types";
import useValidatedFloorParams from "../../hooks/useValidatedFloorParams";
import { GRAPH_SELECT, setMode } from "../../store/features/modeSlice";
import {
  setEditRoomLabel,
  setInfoDisplayActiveTabIndex,
} from "../../store/features/uiSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import GraphInfoDisplay from "./graph/GraphInfoDisplay";
import PoiInfoDisplay from "./poi/PoiInfoDisplay";
import PoilessDisplay from "./poi/PoilessDisplay";
import RoomInfoDisplay from "./room/RoomInfoDisplay";
import RoomlessDisplay from "./room/RoomlessDisplay";

interface Props {
  floorCode: string;
  graph: Graph;
  rooms: Rooms;
  pois: Pois;
}

const InfoDisplay = ({ floorCode, graph, rooms, pois }: Props) => {
  const dispatch = useAppDispatch();
  const activeTabIndex = useAppSelector(
    (state) => state.ui.infoDisplayActiveTabIndex,
  );

  // need at least one of ids for info display
  const { nodeId, roomId, poiId } = useValidatedFloorParams(floorCode);
  if (!nodeId && !roomId && !poiId) {
    return;
  }

  const renderRoomInfoDisplay = () => {
    // roomId is either the roomId in the search param or the roomId of the node
    const resRoomId: string | null = roomId || (nodeId && graph[nodeId].roomId);
    if (resRoomId) {
      return (
        <RoomInfoDisplay
          floorCode={floorCode}
          roomId={resRoomId}
          rooms={rooms}
        />
      );
    }

    // nodeId is either the nodeId in the search param or
    const resNodeId: string | null = nodeId || (poiId && pois[poiId].nodeId);
    if (resNodeId) {
      return (
        <RoomlessDisplay
          floorCode={floorCode}
          nodeId={resNodeId}
          graph={graph}
        />
      );
    }

    // this condition should never occur since we checked that one of the ids is available
    return <></>;
  };

  const renderPoiInfoDisplay = () => {
    // poiId is either the poiId in the search param or the poiId of the node
    const resPoiId =
      poiId ||
      Object.entries(pois).find((poi) => poi[1].nodeId === nodeId)?.[0];

    if (resPoiId) {
      return (
        <PoiInfoDisplay floorCode={floorCode} poiId={resPoiId} pois={pois} />
      );
    } else if (nodeId) {
      return <PoilessDisplay floorCode={floorCode} nodeId={nodeId} />;
    }

    // this condition should never occur since we check either poiId or nodeId is available
    return <></>;
  };

  const renderGraphInfoDisplay = () => {
    // nodeId is either the nodeId in the search param or the nodeId of the poi
    const resNodeId = nodeId || (poiId && pois[poiId].nodeId);
    if (resNodeId) {
      return (
        <GraphInfoDisplay
          floorCode={floorCode}
          nodeId={resNodeId}
          graph={graph}
        />
      );
    }

    // this condition should never occur since we check either poiId or nodeId is available
    return <></>;
  };

  const tabNames = ["Room Info"];
  const tabContents = [renderRoomInfoDisplay];
  // only show poi and graph info if nodeId is available
  if (nodeId || poiId) {
    tabNames.push("POI Info");
    tabContents.push(renderPoiInfoDisplay);

    tabNames.push("Graph Info");
    tabContents.push(renderGraphInfoDisplay);
  }

  const renderTabHeader = (tabName: string, index: number) => {
    const handleClick = () => {
      dispatch(setEditRoomLabel(false));
      dispatch(setInfoDisplayActiveTabIndex(index));
      dispatch(setMode(GRAPH_SELECT));
    };

    return (
      <button
        key={index}
        className={`mb-3 cursor-pointer border-b-2 px-3 pt-4 pb-2 text-center font-medium ${
          index === activeTabIndex
            ? "border-blue-400 text-blue-400"
            : "border-transparent text-gray-400 hover:border-gray-300 hover:text-white"
        }`}
        onClick={handleClick}
      >
        {tabName}
      </button>
    );
  };

  return (
    <div className="flex w-fit flex-col rounded-lg bg-gray-600 px-2 pb-2 text-white shadow-lg">
      <ul className="flex text-sm">
        {tabNames.map((tabName, index) => renderTabHeader(tabName, index))}
      </ul>
      <div>{React.createElement(tabContents[activeTabIndex])}</div>
    </div>
  );
};

export default InfoDisplay;
