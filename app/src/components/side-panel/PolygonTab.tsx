import { useSession } from "@clerk/clerk-react";

import { Rooms, Polygon } from "../../../../shared/types";
import useSavePolygonEdit from "../../hooks/useSavePolygonEdit";
import useValidatedFloorParams from "../../hooks/useValidatedFloorParams";
import { AWS_API_INVOKE_URL } from "../../store/api/s3ApiSlice";
import {
  setMode,
  POLYGON_ADD_VERTEX,
  POLYGON_DELETE_VERTEX,
} from "../../store/features/modeSlice";
import { setRingIndex } from "../../store/features/polygonSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RED_BUTTON_STYLE } from "../info-display/shared/TableCell";
import SidePanelButton from "./SidePanelButton";
import NodeSizeSlider from "./SizeSlider";

interface Props {
  floorCode: string;
  rooms: Rooms;
}

const PolygonTab = ({ floorCode, rooms }: Props) => {
  const { session } = useSession();
  const dispatch = useAppDispatch();

  const ringIndex = useAppSelector((state) => state.polygon.ringIndex);
  const { roomId } = useValidatedFloorParams(floorCode);

  const savePolygonEdit = useSavePolygonEdit(floorCode, roomId);

  if (!roomId) {
    return null;
  }

  const polygon = rooms[roomId].polygon;

  const renderInteriorButton = () => {
    const addHole = async () => {
      const newPolygon: Polygon = JSON.parse(JSON.stringify(polygon));
      newPolygon.coordinates.push([]);
      await savePolygonEdit(newPolygon);
      dispatch(setRingIndex(newPolygon.coordinates.length - 1));
    };

    const deleteHole = () => {
      const newPolygon: Polygon = JSON.parse(JSON.stringify(polygon));
      newPolygon.coordinates.splice(ringIndex, 1);
      dispatch(setRingIndex(ringIndex - 1));
      savePolygonEdit(newPolygon);
    };

    if (ringIndex == 0) {
      return (
        <SidePanelButton
          text="Add Hole"
          handleClick={() => addHole()}
          style="px-2 py-1"
        />
      );
    } else {
      return (
        <SidePanelButton
          text="Delete Hole"
          handleClick={() => deleteHole()}
          style="px-2 py-1"
        />
      );
    }
  };

  const simplifyPolygon = async () => {
    const token = await session?.getToken();

    const result = await fetch(`${AWS_API_INVOKE_URL}/simplify-polygon`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
      body: JSON.stringify({ polygon }),
    });

    const body = await result.json();

    if (!result.ok) {
      console.error(body.error);
      return;
    }

    const newPolygon: Polygon = JSON.parse(body);
    savePolygonEdit(newPolygon);
  };

  const deletePolygon = async () => {
    const newPolygon: Polygon = {
      type: "Polygon",
      coordinates: [[]],
    };
    savePolygonEdit(newPolygon);
  };

  return (
    <div className="mr-2 ml-2 space-y-4">
      <div className="flex space-x-3">
        <select
          value={ringIndex}
          onChange={(e) => dispatch(setRingIndex(Number(e.target.value)))}
          className="rounded"
        >
          {polygon.coordinates.map((_, index) => (
            <option value={index} key={index}>
              {index == 0 ? "Exterior" : "Hole " + index}
            </option>
          ))}
        </select>

        {renderInteriorButton()}
      </div>

      <div className="space-x-2">
        <SidePanelButton
          text="Add Vertex"
          handleClick={() => dispatch(setMode(POLYGON_ADD_VERTEX))}
        />
        <SidePanelButton
          text="Delete Vertex"
          handleClick={() => dispatch(setMode(POLYGON_DELETE_VERTEX))}
        />
      </div>

      <SidePanelButton
        text="Simplify Polygon"
        handleClick={() => simplifyPolygon()}
        style="block"
      />

      <NodeSizeSlider text="Vertex" />

      <SidePanelButton
        text="Delete Polygon"
        handleClick={() => deletePolygon()}
        style={RED_BUTTON_STYLE + " block"}
      />
    </div>
  );
};

export default PolygonTab;
