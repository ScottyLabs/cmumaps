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
import GraphInfoDisplay from "./node-info/GraphInfoDisplay";

interface Props {
  floorCode: string;
  nodeId: string;
}

const InfoDisplay = ({ floorCode, nodeId }: Props) => {
  const dispatch = useAppDispatch();
  const { data: graph } = useGetFloorGraphQuery(floorCode);
  const { data: rooms } = useGetFloorRoomsQuery(floorCode);

  const activeTabIndex = useAppSelector(
    (state) => state.ui.infoDisplayActiveTabIndex,
  );

  if (!graph || !rooms) {
    return;
  }

  const renderElemntInfoDisplay = () => {
    return <></>;

    // return (
    //   <RoomInfoDisplay floorCode={floorCode} rooms={rooms} nodes={graph} />
    // );
  };

  const renderGraphInfoDisplay = () => {
    return (
      <GraphInfoDisplay floorCode={floorCode} nodeId={nodeId} graph={graph} />
    );
  };

  const tabNames = ["Element Info", "Graph Info"];
  const tabContents = [renderElemntInfoDisplay, renderGraphInfoDisplay];

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
      <div>{tabContents[activeTabIndex]()}</div>
    </div>
  );
};

export default InfoDisplay;
