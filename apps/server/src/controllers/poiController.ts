import type { PoiInfo, PoiType } from "@cmumaps/common";
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
import { BEARER_AUTH, MEMBER_SCOPE } from "../middleware/authentication";
import { requireSocketId } from "../middleware/socketAuth";
import { webSocketService } from "../server";
import { poiService } from "../services/poiService";

@Middlewares(requireSocketId)
@Security(BEARER_AUTH, [MEMBER_SCOPE])
@Route("pois")
export class PoiController {
  @Post("/:poiId")
  async createPoi(
    @Request() req: ExpressRequest,
    @Body() body: { poiInfo: PoiInfo },
  ) {
    const poiId = req.params.poiId;
    const { poiInfo } = body;
    const socketId = req.socketId;

    await poiService.createPoi(poiId, poiInfo);
    const payload = { poiId, poiInfo };
    webSocketService.broadcastToUserFloor(socketId, "create-poi", payload);
    return null;
  }

  @Delete("/:poiId")
  async deletePoi(@Request() req: ExpressRequest) {
    const poiId = req.params.poiId;
    const socketId = req.socketId;

    await poiService.deletePoi(poiId);
    const payload = { poiId };
    webSocketService.broadcastToUserFloor(socketId, "delete-poi", payload);
    return null;
  }

  @Put("/:poiId/type")
  async updatePoiType(
    @Request() req: ExpressRequest,
    @Body() body: { poiType: PoiType },
  ) {
    const poiId = req.params.poiId;
    const { poiType } = body;
    const socketId = req.socketId;

    await poiService.updatePoiType(poiId, poiType);
    const payload = { poiId, poiType };
    webSocketService.broadcastToUserFloor(socketId, "update-poi", payload);
    return null;
  }
}
