-- DropForeignKey
ALTER TABLE "CheckpointDistance" DROP CONSTRAINT "CheckpointDistance_event_id_fkey";

-- AddForeignKey
ALTER TABLE "CheckpointDistance" ADD CONSTRAINT "CheckpointDistance_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
