/*
  Warnings:

  - Made the column `event_id` on table `Checkpoint` required. This step will fail if there are existing NULL values in that column.
  - Made the column `event_id` on table `CheckpointDistance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `event_date` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `event_id` on table `Group` required. This step will fail if there are existing NULL values in that column.
  - Made the column `event_id` on table `Penalty` required. This step will fail if there are existing NULL values in that column.
  - Made the column `event_id` on table `Route` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CheckpointDistance" DROP CONSTRAINT "CheckpointDistance_event_id_fkey";

-- AlterTable
ALTER TABLE "Checkpoint" ALTER COLUMN "event_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "CheckpointDistance" ALTER COLUMN "event_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "event_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "event_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Penalty" ALTER COLUMN "event_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Route" ALTER COLUMN "event_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "CheckpointDistance" ADD CONSTRAINT "CheckpointDistance_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
