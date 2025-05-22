/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Checkpoint` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `Checkpoint` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Type" AS ENUM ('START', 'FINISH', 'INTERMEDIATE');

-- AlterTable
ALTER TABLE "Checkpoint" ADD COLUMN     "event_id" INTEGER,
ADD COLUMN     "hint" TEXT,
ADD COLUMN     "type" "Type",
ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "min_route_time" INTEGER,
    "max_route_time" INTEGER,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "event_id" INTEGER,
    "finish_time" TIMESTAMP(3),
    "next_checkpoint_id" INTEGER,
    "route_id" INTEGER,
    "disqualified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Route" (
    "id" SERIAL NOT NULL,
    "route_time" INTEGER NOT NULL,
    "event_id" INTEGER,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteCheckpoint" (
    "id" SERIAL NOT NULL,
    "route_id" INTEGER NOT NULL,
    "checkpoint_id" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "RouteCheckpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckpointDistance" (
    "id" SERIAL NOT NULL,
    "from_id" INTEGER NOT NULL,
    "to_id" INTEGER NOT NULL,
    "time" INTEGER NOT NULL,
    "event_id" INTEGER,

    CONSTRAINT "CheckpointDistance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Penalty" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "penalty_type_id" INTEGER NOT NULL,
    "event_id" INTEGER,

    CONSTRAINT "Penalty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenaltyType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "event_id" INTEGER,

    CONSTRAINT "PenaltyType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_name_key" ON "Event"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_key" ON "Group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RouteCheckpoint_route_id_order_key" ON "RouteCheckpoint"("route_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "CheckpointDistance_from_id_to_id_event_id_key" ON "CheckpointDistance"("from_id", "to_id", "event_id");

-- CreateIndex
CREATE UNIQUE INDEX "PenaltyType_name_key" ON "PenaltyType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Checkpoint_name_key" ON "Checkpoint"("name");

-- AddForeignKey
ALTER TABLE "Checkpoint" ADD CONSTRAINT "Checkpoint_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "Route"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_next_checkpoint_id_fkey" FOREIGN KEY ("next_checkpoint_id") REFERENCES "Checkpoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteCheckpoint" ADD CONSTRAINT "RouteCheckpoint_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteCheckpoint" ADD CONSTRAINT "RouteCheckpoint_checkpoint_id_fkey" FOREIGN KEY ("checkpoint_id") REFERENCES "Checkpoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckpointDistance" ADD CONSTRAINT "CheckpointDistance_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "Checkpoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckpointDistance" ADD CONSTRAINT "CheckpointDistance_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "Checkpoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckpointDistance" ADD CONSTRAINT "CheckpointDistance_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penalty" ADD CONSTRAINT "Penalty_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penalty" ADD CONSTRAINT "Penalty_penalty_type_id_fkey" FOREIGN KEY ("penalty_type_id") REFERENCES "PenaltyType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penalty" ADD CONSTRAINT "Penalty_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenaltyType" ADD CONSTRAINT "PenaltyType_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
