import {
  toggleShowEdges,
  toggleShowPdf,
  toggleShowLabels,
  toggleShowNodes,
  toggleShowOutline,
  toggleShowPolygons,
} from "../../store/features/visibilitySlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import ToggleSwitch from "../shared/ToggleSwitch";

const VisibilityTab = () => {
  const dispatch = useAppDispatch();

  const {
    showPdf,
    showOutline,
    showNodes,
    showEdges,
    showLabels,
    showPolygons,
  } = useAppSelector((state) => state.visibility);

  const renderToggle = (
    text: string,
    isOn: boolean,
    handleToggle: () => void,
  ) => {
    return (
      <div className="flex text-nowrap">
        <p className="mt-1 mr-3">{text}</p>
        <ToggleSwitch isOn={isOn} handleToggle={handleToggle} />
      </div>
    );
  };

  return (
    <div className="mt-1 mr-2 ml-3 space-y-5">
      {renderToggle("Show PDF", showPdf, () => dispatch(toggleShowPdf()))}
      {renderToggle("Show Outline", showOutline, () =>
        dispatch(toggleShowOutline()),
      )}
      {renderToggle("Show Nodes", showNodes, () => dispatch(toggleShowNodes()))}
      {renderToggle("Show Edges", showEdges, () => dispatch(toggleShowEdges()))}
      {renderToggle("Show Labels", showLabels, () =>
        dispatch(toggleShowLabels()),
      )}
      {renderToggle("Show Polygons", showPolygons, () =>
        dispatch(toggleShowPolygons()),
      )}
    </div>
  );
};

export default VisibilityTab;
