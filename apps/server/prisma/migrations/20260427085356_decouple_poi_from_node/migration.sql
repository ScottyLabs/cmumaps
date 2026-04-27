-- AlterTable
ALTER TABLE "Poi" ADD COLUMN "buildingCode" TEXT,
ADD COLUMN     "floorLevel" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- backfill from Node before dropping nodeId
UPDATE "Poi"
SET "latitude" = "Node"."latitude",
    "longitude" = "Node"."longitude",
    "buildingCode" = "Node"."buildingCode",
    "floorLevel" = "Node"."floorLevel"
FROM "Node"
WHERE "Poi"."nodeId" = "Node"."nodeId";

-- AlterTable
ALTER TABLE "Poi" ALTER COLUMN "latitude" SET NOT NULL,
ALTER COLUMN "longitude" SET NOT NULL;

-- DropForeignKey
ALTER TABLE "Poi" DROP CONSTRAINT "Poi_nodeId_fkey";

-- DropIndex
DROP INDEX "Poi_nodeId_key";

-- AlterTable
ALTER TABLE "Poi" DROP COLUMN "nodeId";

-- CreateIndex
CREATE INDEX "Poi_buildingCode_floorLevel_idx" ON "Poi"("buildingCode", "floorLevel");

-- AddForeignKey
ALTER TABLE "Poi" ADD CONSTRAINT "Poi_buildingCode_floorLevel_fkey" FOREIGN KEY ("buildingCode", "floorLevel") REFERENCES "Floor"("buildingCode", "floorLevel") ON DELETE SET NULL ON UPDATE CASCADE;
