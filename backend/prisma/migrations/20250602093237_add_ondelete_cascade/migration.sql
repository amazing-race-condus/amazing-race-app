-- DropForeignKey
ALTER TABLE "RouteCheckpoint" DROP CONSTRAINT "RouteCheckpoint_checkpoint_id_fkey";

-- DropForeignKey
ALTER TABLE "RouteCheckpoint" DROP CONSTRAINT "RouteCheckpoint_route_id_fkey";

-- AddForeignKey
ALTER TABLE "RouteCheckpoint" ADD CONSTRAINT "RouteCheckpoint_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteCheckpoint" ADD CONSTRAINT "RouteCheckpoint_checkpoint_id_fkey" FOREIGN KEY ("checkpoint_id") REFERENCES "Checkpoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
