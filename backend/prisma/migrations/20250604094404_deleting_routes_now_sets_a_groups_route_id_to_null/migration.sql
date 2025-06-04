-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_route_id_fkey";

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "Route"("id") ON DELETE SET NULL ON UPDATE CASCADE;
