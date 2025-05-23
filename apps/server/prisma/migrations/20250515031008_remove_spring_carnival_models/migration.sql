/*
  Warnings:

  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventOccurrence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventTrack` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Track` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventOccurrence" DROP CONSTRAINT "EventOccurrence_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventOccurrence" DROP CONSTRAINT "EventOccurrence_locationId_fkey";

-- DropForeignKey
ALTER TABLE "EventTrack" DROP CONSTRAINT "EventTrack_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventTrack" DROP CONSTRAINT "EventTrack_trackName_fkey";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "EventOccurrence";

-- DropTable
DROP TABLE "EventTrack";

-- DropTable
DROP TABLE "Location";

-- DropTable
DROP TABLE "Track";
