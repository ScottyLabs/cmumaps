import { Line } from "react-konva";

import { DoorInfo } from "../../../../shared/types";
import useFloorInfo from "../../hooks/useFloorInfo";
import { useGetFloorOutlineQuery } from "../../store/api/s3ApiSlice";
import { useAppSelector } from "../../store/hooks";
import { setCursor } from "../../utils/canvasUtils";

interface Props {
  floorCode: string;
}

const OutlineDisplay = ({ floorCode }: Props) => {
  const { buildingCode } = useFloorInfo(floorCode);
  const filePath = `${buildingCode}/${floorCode}.json`;
  const { data: outlineData } = useGetFloorOutlineQuery(filePath);

  const showOutline = useAppSelector((state) => state.visibility.showOutline);

  if (!showOutline || !outlineData) {
    return;
  }

  const drawWalls = () => {
    return outlineData.walls.map((points: number[], index: number) => (
      <Line key={index} points={points} stroke="black" strokeWidth={1} />
    ));
  };

  const drawDoors = () => {
    const doors = outlineData.doors;

    const getStrokeColor = (doorId: string) => {
      if (doors[doorId].roomIds.length != 2) {
        return "red";
      }

      return "purple";
    };

    return Object.entries(doors).map(([doorId, doorInfo]: [string, DoorInfo]) =>
      doorInfo.lineList.map((points, index: number) => (
        // identify bezier curve by number of points
        <Line
          key={doorId + " " + index}
          points={points}
          stroke={getStrokeColor(doorId)}
          strokeWidth={1}
          bezier={points.length == 8}
          onMouseEnter={(e) => setCursor(e, "pointer")}
          onMouseLeave={(e) => setCursor(e, "default")}
        />
      )),
    );
  };

  const drawRoomlessDoors = () => {
    return outlineData.roomlessDoors.map((points, index) => (
      <Line
        key={index}
        points={points}
        stroke={"black"}
        strokeWidth={1}
        bezier={points.length == 8}
      />
    ));
  };

  return (
    <>
      {drawWalls()}
      {drawDoors()}
      {drawRoomlessDoors()}
    </>
  );
};

export default OutlineDisplay;
