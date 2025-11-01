import type { RoomInfo } from "@cmumaps/common";
import type { Request as ExpressRequest } from "express";
import {
  Body,
  Delete,
  Middlewares,
  Patch,
  Post,
  Request,
  Route,
  Security,
} from "tsoa";
import { BEARER_AUTH, MEMBER_SCOPE } from "../middleware/authentication";
import { requireSocketId } from "../middleware/socketAuth";
import { webSocketService } from "../server";
import { floorService } from "../services/floorService";
import { roomService } from "../services/roomService";

@Middlewares(requireSocketId)
@Security(BEARER_AUTH, [MEMBER_SCOPE])
@Route("rooms")
export class RoomController {
  @Post("/:roomId")
  async createRoom(
    @Request() req: ExpressRequest,
    @Body() body: {
      floorCode: string;
      roomNodes: string[];
      roomInfo: RoomInfo;
    },
  ) {
    const roomId = req.params.roomId;
    const { floorCode, roomNodes, roomInfo } = body;
    const socketId = req.socketId;

    const placement = await floorService.getFloorPlacement(floorCode);
    await roomService.createRoom(
      floorCode,
      roomId,
      roomNodes,
      roomInfo,
      placement,
    );
    const payload = { roomId, roomNodes, roomInfo };
    webSocketService.broadcastToUserFloor(socketId, "create-room", payload);
    return null;
  }

  @Delete("/:roomId")
  async deleteRoom(@Request() req: ExpressRequest) {
    const roomId = req.params.roomId;
    const socketId = req.socketId;

    await roomService.deleteRoom(roomId);
    const payload = { roomId };
    webSocketService.broadcastToUserFloor(socketId, "delete-room", payload);
    return null;
  }

  @Patch("/:roomId")
  async updateRoom(
    @Request() req: ExpressRequest,
    @Body() body: { floorCode: string; roomInfo: Partial<RoomInfo> },
  ) {
    const roomId = req.params.roomId;
    const { roomInfo, floorCode } = body;
    const socketId = req.socketId;

    const placement = await floorService.getFloorPlacement(floorCode);
    await roomService.updateRoom(roomId, roomInfo, placement);
    const payload = { roomId, roomInfo };
    webSocketService.broadcastToUserFloor(socketId, "update-room", payload);
    return null;
  }
}
