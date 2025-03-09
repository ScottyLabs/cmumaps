import type { RoomInfo } from "../types.ts";

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
