import type { Request as ExpressRequest } from "express";
import {
  Body,
  Delete,
  Middlewares,
  Post,
  Request,
  Route,
  Security,
} from "tsoa";
import { MEMBER_SCOPE } from "../middleware/authentication";
import { requireSocketId } from "../middleware/socketAuth";
import { webSocketService } from "../server";
import { edgeService } from "../services/edgeService";

@Route("edge")
export class EdgeController {
  @Middlewares(requireSocketId)
  @Security("oauth2", [MEMBER_SCOPE])
  @Post("/")
  async createEdge(
    @Request() req: ExpressRequest,
    @Body() body: { inNodeId: string; outNodeId: string },
  ) {
    const { inNodeId, outNodeId } = body;
    const socketId = req.socketId;

    // create edge in database
    await edgeService.createEdge(inNodeId, outNodeId);

    // broadcast to all users on the floor
    const payload = { inNodeId, outNodeId };
    webSocketService.broadcastToUserFloor(socketId, "create-edge", payload);

    return null;
  }

  @Middlewares(requireSocketId)
  @Security("oauth2", [MEMBER_SCOPE])
  @Delete("/")
  async deleteEdge(
    @Request() req: ExpressRequest,
    @Body() body: { inNodeId: string; outNodeId: string },
  ) {
    const { inNodeId, outNodeId } = body;
    const socketId = req.socketId;

    await edgeService.deleteEdge(inNodeId, outNodeId);
    const payload = { inNodeId, outNodeId };
    webSocketService.broadcastToUserFloor(socketId, "delete-edge", payload);
    return null;
  }

  @Middlewares(requireSocketId)
  @Security("oauth2", [MEMBER_SCOPE])
  @Post("/across-floors")
  async createEdgeAcrossFloors(
    @Request() req: ExpressRequest,
    @Body() body: {
      floorCode: string;
      outFloorCode: string;
      inNodeId: string;
      outNodeId: string;
    },
  ) {
    const { floorCode, outFloorCode, inNodeId, outNodeId } = body;
    const socketId = req.socketId;

    await edgeService.createEdge(inNodeId, outNodeId);
    const payload = { outFloorCode, inNodeId, outNodeId };
    webSocketService.broadcastToUserFloor(
      socketId,
      "create-edge-across-floors",
      payload,
    );

    const inPayload = {
      outFloorCode: floorCode,
      inNodeId: outNodeId,
      outNodeId: inNodeId,
    };
    webSocketService.broadcastToFloor(
      outFloorCode,
      "create-edge-across-floors",
      inPayload,
    );
    return null;
  }

  @Middlewares(requireSocketId)
  @Security("oauth2", [MEMBER_SCOPE])
  @Delete("/across-floors")
  async deleteEdgeAcrossFloors(
    @Request() req: ExpressRequest,
    @Body() body: {
      floorCode: string;
      outFloorCode: string;
      inNodeId: string;
      outNodeId: string;
    },
  ) {
    const { floorCode, outFloorCode, inNodeId, outNodeId } = body;
    const socketId = req.socketId;

    await edgeService.deleteEdge(inNodeId, outNodeId);
    const payload = { outFloorCode, inNodeId, outNodeId };
    webSocketService.broadcastToUserFloor(
      socketId,
      "delete-edge-across-floors",
      payload,
    );

    const inPayload = {
      outFloorCode: floorCode,
      inNodeId: outNodeId,
      outNodeId: inNodeId,
    };
    webSocketService.broadcastToFloor(
      outFloorCode,
      "delete-edge-across-floors",
      inPayload,
    );
    return null;
  }
}
