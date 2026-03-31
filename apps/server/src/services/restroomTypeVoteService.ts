import { prisma } from "../../prisma/index.ts";
import { invalidateSearchContextCache } from "./searchService.ts";

const THRESHOLD = 2;

export const restroomTypeVoteService = {
  async getStatus(roomId: string) {
    const room = await prisma.room.findUnique({
      where: { roomId },
      select: { type: true },
    });
    if (!room) {
      return null;
    }
    const voteCount = await prisma.restroomTypeVote.count({
      where: { roomId },
    });
    return {
      voteCount,
      eligible: room.type === "Default",
      isRestroom: room.type === "Restroom",
    };
  },

  async getMine(roomId: string, userSub: string): Promise<{ voted: boolean }> {
    const row = await prisma.restroomTypeVote.findUnique({
      where: {
        // biome-ignore lint/style/useNamingConvention: Prisma compound unique input
        roomId_userSub: { roomId, userSub },
      },
    });
    return { voted: Boolean(row) };
  },

  async submitVote(
    roomId: string,
    userSub: string,
  ): Promise<
    | { ok: true; voteCount: number; promoted: boolean }
    | { ok: false; reason: "not_found" | "not_eligible" }
  > {
    const room = await prisma.room.findUnique({
      where: { roomId },
      select: { type: true },
    });
    if (!room) {
      return { ok: false, reason: "not_found" };
    }
    if (room.type !== "Default") {
      return { ok: false, reason: "not_eligible" };
    }

    await prisma.restroomTypeVote.upsert({
      where: {
        // biome-ignore lint/style/useNamingConvention: Prisma compound unique input
        roomId_userSub: { roomId, userSub },
      },
      create: { roomId, userSub },
      update: {},
    });

    const voteCount = await prisma.restroomTypeVote.count({
      where: { roomId },
    });

    let promoted = false;
    if (voteCount >= THRESHOLD) {
      const result = await prisma.room.updateMany({
        where: { roomId, type: "Default" },
        data: { type: "Restroom" },
      });
      promoted = result.count > 0;
      if (promoted) {
        invalidateSearchContextCache();
      }
    }

    return { ok: true, voteCount, promoted };
  },
};
