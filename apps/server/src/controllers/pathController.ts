import type { PreciseRoute } from "@cmumaps/common";
import { Get, Query, Route, Security } from "tsoa";
import {
  ADMIN_SCOPE,
  BEARER_AUTH,
  MEMBER_SCOPE,
} from "../middleware/authentication";
import { pathService } from "../services/pathService";

@Route("/path")
export class PathController {
  @Get("/")
  @Security(BEARER_AUTH, [MEMBER_SCOPE])
  public async path(
    @Query() start: string,
    @Query() end: string,
  ): Promise<Record<string, PreciseRoute>> {
    return pathService.calculatePath(start, end);
  }

  @Get("/rebuild")
  @Security(BEARER_AUTH, [ADMIN_SCOPE])
  public async rebuildCache(): Promise<{
    message: string;
    nodeCount: number;
  }> {
    return pathService.rebuildGraphCache();
  }
}
