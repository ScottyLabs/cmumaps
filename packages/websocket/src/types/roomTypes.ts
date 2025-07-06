import type { RoomInfo } from "@cmumaps/common/src/types";

export interface CreateRoomPayload {
  roomId: string;
  roomNodes: string[]; // nodes that belong to this room upon creation
  roomInfo: RoomInfo;
}

export interface DeleteRoomPayload {
  roomId: string;
}

export interface UpdateRoomPayload {
  roomId: string;
  roomInfo: Partial<RoomInfo>;
}
