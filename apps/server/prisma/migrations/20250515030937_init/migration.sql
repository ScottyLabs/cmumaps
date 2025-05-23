-- CreateTable
CREATE TABLE "Building" (
    "buildingCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "osmId" TEXT,
    "labelLatitude" DOUBLE PRECISION NOT NULL,
    "labelLongitude" DOUBLE PRECISION NOT NULL,
    "shape" JSONB NOT NULL,
    "hitbox" JSONB NOT NULL,
    "defaultOrdinal" INTEGER,

    CONSTRAINT "Building_pkey" PRIMARY KEY ("buildingCode")
);

-- CreateTable
CREATE TABLE "Floor" (
    "buildingCode" TEXT NOT NULL,
    "floorLevel" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL,
    "centerX" DOUBLE PRECISION NOT NULL,
    "centerY" DOUBLE PRECISION NOT NULL,
    "centerLatitude" DOUBLE PRECISION NOT NULL,
    "centerLongitude" DOUBLE PRECISION NOT NULL,
    "scale" DOUBLE PRECISION NOT NULL,
    "angle" DOUBLE PRECISION NOT NULL,
    "altitude" DOUBLE PRECISION,

    CONSTRAINT "Floor_pkey" PRIMARY KEY ("buildingCode","floorLevel")
);

-- CreateTable
CREATE TABLE "Room" (
    "roomId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "labelLatitude" DOUBLE PRECISION NOT NULL,
    "labelLongitude" DOUBLE PRECISION NOT NULL,
    "polygon" JSONB NOT NULL,
    "buildingCode" TEXT,
    "floorLevel" TEXT,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("roomId")
);

-- CreateTable
CREATE TABLE "Alias" (
    "alias" TEXT NOT NULL,
    "isDisplayAlias" BOOLEAN NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "Alias_pkey" PRIMARY KEY ("roomId","alias")
);

-- CreateTable
CREATE TABLE "Node" (
    "nodeId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "buildingCode" TEXT,
    "floorLevel" TEXT,
    "roomId" TEXT,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("nodeId")
);

-- CreateTable
CREATE TABLE "Edge" (
    "inNodeId" TEXT NOT NULL,
    "outNodeId" TEXT NOT NULL,

    CONSTRAINT "Edge_pkey" PRIMARY KEY ("inNodeId","outNodeId")
);

-- CreateTable
CREATE TABLE "Poi" (
    "poiId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,

    CONSTRAINT "Poi_pkey" PRIMARY KEY ("poiId")
);

-- CreateTable
CREATE TABLE "EventOccurrence" (
    "eventOccurrenceId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "locationId" TEXT NOT NULL,

    CONSTRAINT "EventOccurrence_pkey" PRIMARY KEY ("eventOccurrenceId")
);

-- CreateTable
CREATE TABLE "EventTrack" (
    "eventId" TEXT NOT NULL,
    "trackName" TEXT NOT NULL,

    CONSTRAINT "EventTrack_pkey" PRIMARY KEY ("eventId","trackName")
);

-- CreateTable
CREATE TABLE "Event" (
    "eventId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "req" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "Location" (
    "locationId" TEXT NOT NULL,
    "locationName" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("locationId")
);

-- CreateTable
CREATE TABLE "Track" (
    "trackName" TEXT NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("trackName")
);

-- CreateIndex
CREATE INDEX "Room_buildingCode_floorLevel_idx" ON "Room"("buildingCode", "floorLevel");

-- CreateIndex
CREATE INDEX "Node_buildingCode_floorLevel_idx" ON "Node"("buildingCode", "floorLevel");

-- CreateIndex
CREATE UNIQUE INDEX "Poi_nodeId_key" ON "Poi"("nodeId");

-- AddForeignKey
ALTER TABLE "Floor" ADD CONSTRAINT "Floor_buildingCode_fkey" FOREIGN KEY ("buildingCode") REFERENCES "Building"("buildingCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_buildingCode_floorLevel_fkey" FOREIGN KEY ("buildingCode", "floorLevel") REFERENCES "Floor"("buildingCode", "floorLevel") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alias" ADD CONSTRAINT "Alias_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_buildingCode_floorLevel_fkey" FOREIGN KEY ("buildingCode", "floorLevel") REFERENCES "Floor"("buildingCode", "floorLevel") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("roomId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_inNodeId_fkey" FOREIGN KEY ("inNodeId") REFERENCES "Node"("nodeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_outNodeId_fkey" FOREIGN KEY ("outNodeId") REFERENCES "Node"("nodeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poi" ADD CONSTRAINT "Poi_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node"("nodeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventOccurrence" ADD CONSTRAINT "EventOccurrence_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventOccurrence" ADD CONSTRAINT "EventOccurrence_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("locationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTrack" ADD CONSTRAINT "EventTrack_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTrack" ADD CONSTRAINT "EventTrack_trackName_fkey" FOREIGN KEY ("trackName") REFERENCES "Track"("trackName") ON DELETE RESTRICT ON UPDATE CASCADE;
