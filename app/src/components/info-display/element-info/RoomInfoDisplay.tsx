import { SingleValue } from "react-select";

import {
  RoomInfo,
  Rooms,
  RoomType,
  RoomTypes,
} from "../../../../../shared/types";
import { renderCell } from "../../../utils/displayUtils";
import EditCell from "./EditCell";
import SelectTypeCell from "./SelectTypeCell";

interface Props {
  floorCode: string;
  roomId: string;
  rooms: Rooms;
}

const RoomInfoDisplay = ({ roomId, rooms }: Props) => {
  const room = rooms[roomId];

  const renderRoomIdRow = () => {
    return (
      <tr>
        {renderCell("Room ID")}
        {renderCell(roomId, "truncate")}
      </tr>
    );
  };

  const handleSaveHelper = async (roomInfo: RoomInfo) => {
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
        <td className="border pr-4 pl-4">Name</td>
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
        <td className="border pr-4 pl-4">Type</td>
        <SelectTypeCell
          key={roomId}
          value={room.type}
          typeList={RoomTypes as readonly string[]}
          handleChange={handleChange}
        />
      </tr>
    );
  };

  const renderEditAliasesRow = () => {
    return (
      <tr>
        <td className="border pr-4 pl-4">Aliases</td>
        <td className="border p-2 text-black">
          <AliasesMultiSelect
            key={roomId}
            room={room}
            handleSaveHelper={handleSaveHelper}
          />
        </td>
      </tr>
    );
  };

  return (
    <>
      <table className="w-72 table-fixed">
        <thead>
          <tr>
            {renderCell("Property", "font-bold w-28")}
            {renderCell("Value", "font-bold")}
          </tr>
        </thead>
        <tbody>
          {renderRoomIdRow()}
          {renderEditNameRow()}
          {renderEditTypeRow()}
          {/* {renderEditAliasesRow()} */}
          {/* <RoomInfoButtons floorCode={floorCode} nodes={nodes} /> */}
        </tbody>
      </table>
    </>
  );
};

export default RoomInfoDisplay;
