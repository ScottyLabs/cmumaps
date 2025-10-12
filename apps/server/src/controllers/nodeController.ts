import type { NodeInfo } from "@cmumaps/common";
import type { Request as ExpressRequest } from "express";
import {
  Body,
  Delete,
  Middlewares,
  Post,
  Put,
  Request,
  Route,
  Security,
} from "tsoa";
import { MEMBER_SCOPE } from "../middleware/authentication";
import { requireSocketId } from "../middleware/socketAuth";
import { webSocketService } from "../server";
import { edgeService } from "../services/edgeService";
import { floorService } from "../services/floorService";
import { nodeService } from "../services/nodeService";

@Route("nodes")
export class NodeController {
  @Middlewares(requireSocketId)
  @Security("oauth2", [MEMBER_SCOPE])
  @Post("/:nodeId")
  async createNode(
    @Request() req: ExpressRequest,
    @Body() body: { floorCode: string; nodeInfo: NodeInfo },
  ) {
    const { floorCode, nodeInfo } = body;
    const nodeId = req.params.nodeId;
    const socketId = req.socketId;

    // create node in database
    const placement = await floorService.getFloorPlacement(floorCode);
    await nodeService.upsertNode(floorCode, nodeId, nodeInfo, placement);

    // create edges to neighbors if they don't already exist
    await edgeService.createEdges(nodeId, Object.keys(nodeInfo.neighbors));

    // broadcast to all users on the floor
    const payload = { nodeId, nodeInfo };
    webSocketService.broadcastToUserFloor(socketId, "create-node", payload);

    return null;
  }

  @Middlewares(requireSocketId)
  @Security("oauth2", [MEMBER_SCOPE])
  @Delete("/:nodeId")
  async deleteNode(@Request() req: ExpressRequest) {
    const nodeId = req.params.nodeId;
    const socketId = req.socketId;
    await edgeService.deleteEdges(nodeId);
    await nodeService.deleteNode(nodeId);
    webSocketService.broadcastToUserFloor(socketId, "delete-node", { nodeId });
    return null;
  }

  @Middlewares(requireSocketId)
  @Security("oauth2", [MEMBER_SCOPE])
  @Put("/:nodeId")
  async updateNode(
    @Request() req: ExpressRequest,
    @Body() body: { nodeInfo: NodeInfo; floorCode: string },
  ) {
    const { nodeInfo, floorCode } = body;
    const nodeId = req.params.nodeId;
    const socketId = req.socketId;

    const placement = await floorService.getFloorPlacement(floorCode);
    await nodeService.upsertNode(floorCode, nodeId, nodeInfo, placement);
    const payload = { nodeId, nodeInfo };
    webSocketService.broadcastToUserFloor(socketId, "update-node", payload);
    return null;
  }
}
