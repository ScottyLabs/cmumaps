import type { PreciseRoute } from "@cmumaps/common";
import { Get, Query, Route, Security } from "tsoa";
import { BEARER_AUTH } from "../middleware/authentication";
import { pathService } from "../services/pathService";

@Route("/path")
export class PathController {
  @Get("/")
  @Security(BEARER_AUTH, [])
  public async path(
    @Query() start: string,
    @Query() end: string,
  ): Promise<Record<string, PreciseRoute>> {
    return pathService.calculatePath(start, end);
  }
}
