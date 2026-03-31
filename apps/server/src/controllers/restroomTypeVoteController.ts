import type { Request as ExpressRequest } from "express";
import { Get, OperationId, Path, Put, Request, Route, Security } from "tsoa";
import { BEARER_AUTH, OIDC_AUTH } from "../lib/authentication.ts";
import { HttpError } from "../middleware/errorHandler.ts";
import { restroomTypeVoteService } from "../services/restroomTypeVoteService.ts";

function getUserSub(req: ExpressRequest): string {
  if (!req.user?.sub) {
    throw new HttpError(401, "Unauthenticated");
  }
  return req.user.sub;
}

@Route("restroom-type-votes")
export class RestroomTypeVoteController {
  @Get("/{roomId}/status")
  @OperationId("GetRestroomTypeVoteStatus")
  public async getStatus(@Path() roomId: string) {
    const status = await restroomTypeVoteService.getStatus(roomId);
    if (!status) {
      throw new HttpError(404, "Room not found");
    }
    return status;
  }

  @Get("/{roomId}/mine")
  @OperationId("GetRestroomTypeVoteMine")
  @Security(OIDC_AUTH, [])
  @Security(BEARER_AUTH, [])
  public async getMine(
    @Request() req: ExpressRequest,
    @Path() roomId: string,
  ): Promise<{ voted: boolean }> {
    return await restroomTypeVoteService.getMine(roomId, getUserSub(req));
  }

  @Put("/{roomId}")
  @OperationId("PutRestroomTypeVote")
  @Security(OIDC_AUTH, [])
  @Security(BEARER_AUTH, [])
  public async putVote(@Request() req: ExpressRequest, @Path() roomId: string) {
    const result = await restroomTypeVoteService.submitVote(
      roomId,
      getUserSub(req),
    );
    if (!result.ok) {
      if (result.reason === "not_found") {
        throw new HttpError(404, "Room not found");
      }
      throw new HttpError(
        400,
        "This room cannot be crowd-labeled as a restroom (only Default-type rooms are eligible).",
      );
    }
    return result;
  }
}
