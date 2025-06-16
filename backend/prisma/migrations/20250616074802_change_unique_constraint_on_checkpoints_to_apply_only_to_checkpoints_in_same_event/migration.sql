/*
  Warnings:

  - A unique constraint covering the columns `[name,event_id]` on the table `Checkpoint` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Checkpoint_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Checkpoint_name_event_id_key" ON "Checkpoint"("name", "event_id");
