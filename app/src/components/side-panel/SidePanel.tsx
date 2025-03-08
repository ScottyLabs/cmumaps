import { useState } from "react";

import { Graph, Rooms } from "../../../../shared/types";
import { selectEditPolygon } from "../../store/features/modeSlice";
import { useAppSelector } from "../../store/hooks";
import GraphTab from "./GraphTab";
import PolygonTab from "./PolygonTab";
import VisibilityTab from "./VisibilityTab";

interface Props {
  floorCode: string;
  graph: Graph;
  rooms: Rooms;
}

const SidePanel = ({ floorCode, graph, rooms }: Props) => {
  const editPolygon = useAppSelector(selectEditPolygon);

  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

  const tabNames = editPolygon
    ? ["Visibility", "Polygon"]
    : ["Visibility", "Graph"];

  const renderVisibilityTab = () => <VisibilityTab floorCode={floorCode} />;

  const renderGraphTab = () => <></>;

  const renderPolygonTab = () => <></>;

  const tabContents = editPolygon
    ? [renderVisibilityTab, renderPolygonTab]
    : [renderVisibilityTab, renderGraphTab];

  return (
    <div className="h-[25em] w-fit rounded-lg border bg-slate-400 shadow-lg">
      <h1 className="pt-2 text-center text-xl underline">Settings</h1>
      <ul className="flex text-sm">
        {tabNames.map((tabName, index) => (
          <button
            key={index}
            className={`mb-3 cursor-pointer border-b-2 px-3 pt-4 pb-2 text-center font-medium ${
              activeTabIndex === index
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
            onClick={() => setActiveTabIndex(index)}
          >
            {tabName}
          </button>
        ))}
      </ul>
      {tabContents[activeTabIndex]()}
    </div>
  );
};

export default SidePanel;
