import type { RoomInfo } from "../types.ts";

export interface CreateRoomPayload {
  roomId: string;
  roomInfo: RoomInfo;
}

export interface DeleteRoomPayload {
  roomId: string;
}

export interface UpdateRoomPayload {
  roomId: string;
  roomInfo: Partial<RoomInfo>;
}
