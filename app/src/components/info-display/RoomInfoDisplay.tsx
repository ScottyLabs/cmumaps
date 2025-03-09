import { SingleValue } from "react-select";
import { toast } from "react-toastify";

import {
  RoomInfo,
  Rooms,
  RoomType,
  RoomTypes,
} from "../../../../../shared/types";
import CopyIdRow from "../shared/CopyIdRow";
import EditCell from "../shared/EditCell";
import SelectTypeCell from "../shared/SelectTypeCell";
import TableCell from "../shared/TableCell";
import TableLayout from "../shared/TableLayout";

interface Props {
  floorCode: string;
  roomId: string;
  rooms: Rooms;
}

const RoomInfoDisplay = ({ roomId, rooms }: Props) => {
  const room = rooms[roomId];

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

  return (
    <TableLayout>
      <CopyIdRow text="Room ID" id={roomId} />
      {renderEditNameRow()}
      {renderEditTypeRow()}
      {/* {renderEditAliasesRow()} */}
      {/* <RoomInfoButtons floorCode={floorCode} nodes={nodes} /> */}
    </TableLayout>
  );
};

export default RoomInfoDisplay;
