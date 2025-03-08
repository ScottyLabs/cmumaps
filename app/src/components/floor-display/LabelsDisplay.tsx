import { TfiLocationPin } from "react-icons/tfi";
import { Group, Path, Rect, Text } from "react-konva";

import { Graph, Rooms } from "../../../../shared/types";
import { useAppSelector } from "../../store/hooks";
import { setCursor } from "../../utils/canvasUtils";

interface Props {
  floorCode: string;
  graph: Graph;
  rooms: Rooms;
}

const LabelsDisplay = ({ rooms }: Props) => {
  // const editRoomLabel = useAppSelector((state) => state.ui.editRoomLabel);
  const showLabels = useAppSelector((state) => state.visibility.showLabels);

  // label icon
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const path = TfiLocationPin({}).props.children[1].props.d;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const viewBox = TfiLocationPin({}).props.attr.viewBox.split(" ");
  const width = Number(viewBox[2]);
  const height = Number(viewBox[3]);

  return Object.entries(rooms).map(([roomId, room]) => {
    // selected if it is edit label mode and it is the label of the selected room
    // or the room of the label is connected by the selected door
    // const selected =
    //   (editRoomLabel && roomIdSelected == roomId) ||
    //   (idSelected.type == DOOR &&
    //     doors[idSelected.id].roomIds.includes(roomId));

    const selected = false;

    // don't show label when not showing all labels and not selected
    if (!showLabels) {
      return;
    }

    // const draggable = editRoomLabel && roomIdSelected == roomId;

    // const handleOnDragEnd = (e) => {
    //   const oldRoom = rooms[roomId];
    //   const newRoom: RoomInfo = {
    //     ...oldRoom,
    //     labelPosition: {
    //       x: Number((e.target.x() + width / 2).toFixed(2)),
    //       y: Number((e.target.y() + height).toFixed(2)),
    //     },
    //   };
    //   upsertRoom({ floorCode, roomId, newRoom, oldRoom });
    // };

    // const handleClick = () => {
    //   const nodeInfo = Object.entries(graph).filter(
    //     (nodeInfo) => nodeInfo[1].roomId == roomId,
    //   )[0];

    //   if (nodeInfo) {
    //     router.push(`?nodeId=${nodeInfo[0]}`);
    //   } else {
    //     addNewNode({
    //       pos: room.labelPosition,
    //       neighbors: {},
    //       roomId,
    //     });
    //   }
    // };

    return (
      <Group
        x={room.labelPosition.x - width / 2}
        y={room.labelPosition.y - height}
        key={roomId}
        // draggable={draggable}
        onMouseEnter={(e) => setCursor(e, "pointer")}
        onMouseLeave={(e) => setCursor(e, "default")}
      >
        <Path fill={selected ? "orange" : "indigo"} data={path} />
        <Rect width={Number(width)} height={Number(height)} />
        <Text text={room.name} y={height + 2} />
      </Group>
    );
  });
};

export default LabelsDisplay;
