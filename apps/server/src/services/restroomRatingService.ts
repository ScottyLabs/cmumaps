import { prisma } from "../../prisma/index.ts";

export interface RestroomRatingSummary {
  average: number | null;
  count: number;
}

export interface RestroomLeaderboardEntry {
  roomId: string;
  name: string;
  buildingCode: string | null;
  floorLevel: string | null;
  labelLatitude: number;
  labelLongitude: number;
  averageStars: number;
  ratingCount: number;
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

  async getLeaderboard(limit: number): Promise<RestroomLeaderboardEntry[]> {
    const grouped = await prisma.restroomRating.groupBy({
      by: ["roomId"],
      _avg: { stars: true },
      _count: { _all: true },
    });
    if (grouped.length === 0) {
      return [];
    }
    const roomIds = grouped.map((g) => g.roomId);
    const rooms = await prisma.room.findMany({
      where: {
        roomId: { in: roomIds },
        type: "Restroom",
        buildingCode: { not: null },
        floorLevel: { not: null },
      },
      select: {
        roomId: true,
        name: true,
        buildingCode: true,
        floorLevel: true,
        labelLatitude: true,
        labelLongitude: true,
      },
    });
    const roomById = new Map(rooms.map((r) => [r.roomId, r]));
    const rows: RestroomLeaderboardEntry[] = [];
    for (const g of grouped) {
      if (g._avg.stars === null || g._avg.stars === undefined) {
        continue;
      }
      const r = roomById.get(g.roomId);
      if (!(r?.buildingCode && r.floorLevel)) {
        continue;
      }
      rows.push({
        roomId: r.roomId,
        name: r.name,
        buildingCode: r.buildingCode,
        floorLevel: r.floorLevel,
        labelLatitude: r.labelLatitude,
        labelLongitude: r.labelLongitude,
        averageStars: Number(g._avg.stars),
        ratingCount: g._count._all,
      });
    }
    rows.sort((a, b) => {
      if (b.averageStars !== a.averageStars) {
        return b.averageStars - a.averageStars;
      }
      return b.ratingCount - a.ratingCount;
    });
    return rows.slice(0, limit);
  },
};
