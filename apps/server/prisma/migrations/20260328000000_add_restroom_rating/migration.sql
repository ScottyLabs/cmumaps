-- CreateTable
CREATE TABLE "RestroomRating" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userSub" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestroomRating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RestroomRating_roomId_userSub_key" ON "RestroomRating"("roomId", "userSub");

-- CreateIndex
CREATE INDEX "RestroomRating_roomId_idx" ON "RestroomRating"("roomId");

-- AddForeignKey
ALTER TABLE "RestroomRating" ADD CONSTRAINT "RestroomRating_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("roomId") ON DELETE CASCADE ON UPDATE CASCADE;
