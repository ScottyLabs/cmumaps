import { RoomInfo } from '../types';

export interface CreateRoomPayload {
    roomId: string;
    roomNodes: string[];
    roomInfo: RoomInfo;
}
export interface DeleteRoomPayload {
    roomId: string;
}
export interface UpdateRoomPayload {
    roomId: string;
    roomInfo: Partial<RoomInfo>;
}
