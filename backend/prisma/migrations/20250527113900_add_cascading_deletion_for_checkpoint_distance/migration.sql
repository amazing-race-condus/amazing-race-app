-- DropForeignKey
ALTER TABLE "CheckpointDistance" DROP CONSTRAINT "CheckpointDistance_from_id_fkey";

-- DropForeignKey
ALTER TABLE "CheckpointDistance" DROP CONSTRAINT "CheckpointDistance_to_id_fkey";

-- AddForeignKey
ALTER TABLE "CheckpointDistance" ADD CONSTRAINT "CheckpointDistance_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "Checkpoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckpointDistance" ADD CONSTRAINT "CheckpointDistance_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "Checkpoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
