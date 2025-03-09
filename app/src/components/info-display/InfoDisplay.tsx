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
import RoomInfoDisplay from "./room/RoomInfoDisplay";

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

  // need at least one of nodeId or roomId for info display
  const { nodeId, roomId } = useValidatedFloorParams(floorCode);
  if (!nodeId && !roomId) {
    return;
  }

  const renderRoomInfoDisplay = () => {
    if (roomId) {
      return (
        <RoomInfoDisplay floorCode={floorCode} roomId={roomId} rooms={rooms} />
      );
    }
  };

  const renderPoiInfoDisplay = () => {
    const poiId = Object.values(pois).find(
      (poi) => poi.nodeId === nodeId,
    )?.nodeId;

    if (poiId) {
      <PoiInfoDisplay floorCode={floorCode} poiId={poiId} pois={pois} />;
    } else {
      return <></>;
    }
  };

  const renderGraphInfoDisplay = (nodeId: string) => {
    const Component = () => (
      <GraphInfoDisplay floorCode={floorCode} nodeId={nodeId} graph={graph} />
    );
    Component.displayName = "PoiInfoDisplay";
    return Component;
  };

  const tabNames = ["Room Info", "POI Info"];
  const tabContents = [renderRoomInfoDisplay, renderPoiInfoDisplay];
  if (nodeId) {
    tabNames.push("Graph Info");
    tabContents.push(renderGraphInfoDisplay(nodeId));
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
      <ul className="flex">
        {tabNames.map((tabName, index) => renderTabHeader(tabName, index))}
      </ul>
      <div>{tabContents[activeTabIndex]()}</div>
    </div>
  );
};

export default InfoDisplay;
