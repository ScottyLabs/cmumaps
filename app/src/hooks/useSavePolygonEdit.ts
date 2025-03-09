import { Polygon } from "geojson";
import { v4 as uuidv4 } from "uuid";

import { RoomInfo } from "../../../shared/types";
import { useUpdateRoomMutation } from "../store/api/roomApiSlice";

const useSavePolygonEdit = (floorCode: string, roomId?: string | null) => {
  const [updateRoom] = useUpdateRoomMutation();

  const savePolygonEdit = async (polygon: Polygon) => {
    const roomInfo: Partial<RoomInfo> = { polygon };
    if (roomId) {
      await updateRoom({ floorCode, roomId, roomInfo, batchId: uuidv4() });
    }
  };

  return savePolygonEdit;
};

export default useSavePolygonEdit;
