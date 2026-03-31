import type { Request as ExpressRequest } from "express";
import {
  Body,
  Get,
  OperationId,
  Path,
  Put,
  Query,
  Request,
  Route,
  Security,
} from "tsoa";
import { BEARER_AUTH, OIDC_AUTH } from "../lib/authentication.ts";
import { HttpError } from "../middleware/errorHandler.ts";
import type { RestroomLeaderboardEntry } from "../services/restroomRatingService.ts";
import { restroomRatingService } from "../services/restroomRatingService.ts";

function getUserSub(req: ExpressRequest): string {
  if (!req.user?.sub) {
    throw new HttpError(401, "Unauthenticated");
  }
  return req.user.sub;
}

@Route("restroom-ratings")
export class RestroomRatingController {
  /** Top-rated restrooms by average stars (descending), then by number of ratings. */
  @Get("/leaderboard")
  public async getLeaderboard(
    @Query() limit?: number,
  ): Promise<RestroomLeaderboardEntry[]> {
    const n =
      typeof limit === "number" &&
      Number.isFinite(limit) &&
      Number.isInteger(limit)
        ? Math.min(50, Math.max(1, limit))
        : 10;
    return await restroomRatingService.getLeaderboard(n);
  }

  @Get("/{roomId}/summary")
  public async getSummary(@Path() roomId: string) {
    return await restroomRatingService.getSummary(roomId);
  }

  @Get("/{roomId}/mine")
  @OperationId("GetRestroomRatingMine")
  @Security(OIDC_AUTH, [])
  @Security(BEARER_AUTH, [])
  public async getMine(
    @Request() req: ExpressRequest,
    @Path() roomId: string,
  ): Promise<{ stars: number | null }> {
    return await restroomRatingService.getMine(roomId, getUserSub(req));
  }

  @Put("/{roomId}")
  @Security(OIDC_AUTH, [])
  @Security(BEARER_AUTH, [])
  public async putRating(
    @Request() req: ExpressRequest,
    @Path() roomId: string,
    @Body() body: { stars: number },
  ) {
    const stars = Number(body.stars);
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      throw new HttpError(400, "stars must be an integer from 1 to 5");
    }
    await restroomRatingService.putRating(roomId, getUserSub(req), stars);
    return { ok: true as const };
  }
}
