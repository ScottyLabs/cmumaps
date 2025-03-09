import { v4 as uuidv4 } from "uuid";

import { SingleValue } from "react-select";
import { toast } from "react-toastify";

import {
  Rooms,
  RoomInfo,
  RoomType,
  RoomTypes,
} from "../../../../../shared/types";
import { useDeleteRoomMutation } from "../../../store/api/roomApiSlice";
import Button from "../shared/Button";
import CopyIdRow from "../shared/CopyIdRow";
import EditCell from "../shared/EditCell";
import SelectTypeCell from "../shared/SelectTypeCell";
import TableCell, { RED_BUTTON_STYLE } from "../shared/TableCell";
import TableLayout from "../shared/TableLayout";

interface Props {
  floorCode: string;
  roomId: string;
  rooms: Rooms;
}

const RoomInfoDisplay = ({ floorCode, roomId, rooms }: Props) => {
  const room = rooms[roomId];
  const [deleteRoom] = useDeleteRoomMutation();

  const handleSaveHelper = async (roomInfo: RoomInfo) => {
    toast.error("Unimplemented!");
    console.log(roomInfo);
  };

  const renderEditNameRow = () => {
    const handleSaveName = async (editedValue: string | undefined) => {
      if (editedValue) {
        const newRoomInfo = { ...room, name: editedValue };
        handleSaveHelper(newRoomInfo);
      }
    };

    return (
      <tr>
        <TableCell text="Name" />
        <EditCell
          property="name"
          value={room.name}
          handleSave={handleSaveName}
        />
      </tr>
    );
  };

  const renderEditTypeRow = () => {
    const handleChange =
      () =>
      async (
        newValue: SingleValue<{
          value: string | undefined;
          label: string | undefined;
        }>,
      ) => {
        if (newValue?.value && newValue?.value !== room.type) {
          const newRoomInfo = { ...room, type: newValue.value as RoomType };
          handleSaveHelper(newRoomInfo);
        }
      };

    return (
      <tr>
        <TableCell text="Type" />
        <SelectTypeCell
          key={roomId}
          value={room.type}
          typeList={RoomTypes as readonly string[]}
          handleChange={handleChange}
        />
      </tr>
    );
  };

  const deleteRoomHelper = () =>
    deleteRoom({ floorCode, roomId, batchId: uuidv4() });

  return (
    <>
      <TableLayout>
        <CopyIdRow text="Room ID" id={roomId} />
        {renderEditNameRow()}
        {renderEditTypeRow()}
        {/* {renderEditAliasesRow()} */}
        {/* <RoomInfoButtons floorCode={floorCode} nodes={nodes} /> */}
      </TableLayout>
      <div className="mt-2 flex flex-row-reverse">
        <Button
          text="Delete Room"
          handleClick={deleteRoomHelper}
          style={RED_BUTTON_STYLE + " text-base"}
        />
      </div>
    </>
  );
};

export default RoomInfoDisplay;
