import { prisma } from "../../prisma/index.ts";

export interface RestroomRatingSummary {
  average: number | null;
  count: number;
}

export const restroomRatingService = {
  async getSummary(roomId: string): Promise<RestroomRatingSummary> {
    const agg = await prisma.restroomRating.aggregate({
      where: { roomId },
      _avg: { stars: true },
      _count: { _all: true },
    });
    const avg = agg._avg.stars;
    return {
      average: avg === null || avg === undefined ? null : Number(avg),
      count: agg._count._all,
    };
  },

  async getMine(
    roomId: string,
    userSub: string,
  ): Promise<{ stars: number | null }> {
    const row = await prisma.restroomRating.findFirst({
      where: { roomId, userSub },
    });
    return { stars: row?.stars ?? null };
  },

  async putRating(roomId: string, userSub: string, stars: number) {
    await prisma.restroomRating.upsert({
      where: {
        // biome-ignore lint/style/useNamingConvention: Prisma compound unique input
        roomId_userSub: { roomId, userSub },
      },
      create: { roomId, userSub, stars },
      update: { stars },
    });
  },
};
