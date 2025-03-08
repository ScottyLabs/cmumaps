import React from "react";

import { ElementType } from "../../../../shared/types";
import useValidatedFloorParams from "../../hooks/useValidatedFloorParams";
import {
  useGetFloorGraphQuery,
  useGetFloorRoomsQuery,
} from "../../store/api/floorDataApiSlice";
import { GRAPH_SELECT, setMode } from "../../store/features/modeSlice";
import {
  setEditRoomLabel,
  setInfoDisplayActiveTabIndex,
} from "../../store/features/uiSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import ElementlessDisplay from "./element-info/ElementlessDisplay";
import RoomInfoDisplay from "./element-info/RoomInfoDisplay";
import GraphInfoDisplay from "./node-info/GraphInfoDisplay";

interface Props {
  floorCode: string;
}

const InfoDisplay = ({ floorCode }: Props) => {
  const dispatch = useAppDispatch();
  const { data: graph } = useGetFloorGraphQuery(floorCode);
  const { data: rooms } = useGetFloorRoomsQuery(floorCode);

  const { nodeId, roomId } = useValidatedFloorParams(floorCode);

  const activeTabIndex = useAppSelector(
    (state) => state.ui.infoDisplayActiveTabIndex,
  );

  if (!graph || !rooms) {
    return;
  }

  // need at least one of nodeId or roomId for info display
  if (!nodeId && !roomId) {
    return;
  }

  const renderElementlessDisplay = (nodeId: string) => () => {
    const Component = () => (
      <ElementlessDisplay floorCode={floorCode} nodeId={nodeId} graph={graph} />
    );
    Component.displayName = "ElementlessDisplay";
    return Component;
  };

  const renderElementInfoDisplay =
    (roomId: string, type: ElementType) => () => {
      if (type === "room") {
        const Component = () => (
          <RoomInfoDisplay
            floorCode={floorCode}
            roomId={roomId}
            rooms={rooms}
          />
        );
        Component.displayName = "RoomInfoDisplay";
        return Component;
      } else if (type === "poi") {
        const Component = () => <></>;
        Component.displayName = "PoiInfoDisplay";
        return Component;
      }
      // this condition should never occur since
      // we check that elementId is not null before calling this function,
      // which implies that type is either "room" or "poi"
      else {
        const Component = () => <></>;
        return Component;
      }
    };

  const renderGraphInfoDisplay = (nodeId: string) => () => {
    const Component = () => (
      <GraphInfoDisplay floorCode={floorCode} nodeId={nodeId} graph={graph} />
    );
    Component.displayName = "GraphInfoDisplay";
    return Component;
  };

  const { tabNames, tabContents } = (() => {
    if (nodeId) {
      const tabNames = ["Element Info", "Graph Info"];
      if (graph[nodeId].elementId) {
        const tabContents = [
          renderElementInfoDisplay(graph[nodeId].elementId, graph[nodeId].type),
          renderGraphInfoDisplay(nodeId),
        ];
        return { tabNames, tabContents };
      } else {
        const tabContents = [
          renderElementlessDisplay(nodeId),
          renderGraphInfoDisplay(nodeId),
        ];
        return { tabNames, tabContents };
      }
    } else if (roomId) {
      return {
        tabNames: ["Element Info"],
        tabContents: [renderElementInfoDisplay(roomId, "room")],
      };
    }
    // this condition should never occur since
    // we check for either nodeId and roomId is not null earlier in this file
    else {
      return { tabNames: [], tabContents: [] };
    }
  })();

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
      <div>{React.createElement(tabContents[activeTabIndex]())}</div>
    </div>
  );
};

export default InfoDisplay;
