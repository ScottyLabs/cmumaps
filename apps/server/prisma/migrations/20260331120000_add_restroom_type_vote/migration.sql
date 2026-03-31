-- CreateTable
CREATE TABLE "RestroomTypeVote" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userSub" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestroomTypeVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RestroomTypeVote_roomId_userSub_key" ON "RestroomTypeVote"("roomId", "userSub");

-- CreateIndex
CREATE INDEX "RestroomTypeVote_roomId_idx" ON "RestroomTypeVote"("roomId");

-- AddForeignKey
ALTER TABLE "RestroomTypeVote" ADD CONSTRAINT "RestroomTypeVote_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("roomId") ON DELETE CASCADE ON UPDATE CASCADE;
