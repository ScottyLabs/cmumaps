import { useGetFloorGraphQuery } from "../../store/api/floorDataApiSlice";
import { GRAPH_SELECT, setMode } from "../../store/features/modeSlice";
import {
  setEditRoomLabel,
  setInfoDisplayActiveTabIndex,
} from "../../store/features/uiSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import GraphInfoDisplay from "./node-info/GraphInfoDisplay";

interface Props {
  floorCode: string;
}

const InfoDisplay = ({ floorCode }: Props) => {
  const dispatch = useAppDispatch();
  const { data: graph } = useGetFloorGraphQuery(floorCode);
  // const { data: rooms } = useGetRoomsQuery(floorCode);

  const activeTabIndex = useAppSelector(
    (state) => state.ui.infoDisplayActiveTabIndex,
  );

  // const renderRoomInfoDisplay = () => {
  //   if (nodes && rooms) {
  //     return (
  //       <RoomInfoDisplay floorCode={floorCode} rooms={rooms} nodes={nodes} />
  //     );
  //   }
  // };

  const renderGraphInfoDisplay = () => {
    if (graph) {
      return <GraphInfoDisplay floorCode={floorCode} graph={graph} />;
    }
  };

  const tabNames = ["Graph Info"];
  const tabContents = [renderGraphInfoDisplay];

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
    <div className="flex max-h-96 w-fit flex-col rounded-lg bg-gray-600 px-2 pb-2 text-white shadow-lg">
      <ul className="flex text-sm">
        {tabNames.map((tabName, index) => renderTabHeader(tabName, index))}
      </ul>
      <div className="flex overflow-y-auto">
        {tabContents[activeTabIndex]()}
      </div>
    </div>
  );
};

export default InfoDisplay;
