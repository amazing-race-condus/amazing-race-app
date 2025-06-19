/*
  Warnings:

  - A unique constraint covering the columns `[name,event_id]` on the table `Group` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Group_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_event_id_key" ON "Group"("name", "event_id");
