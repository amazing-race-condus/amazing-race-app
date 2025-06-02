/*
  Warnings:

  - You are about to drop the column `order` on the `RouteCheckpoint` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[route_id,checkpoint_order]` on the table `RouteCheckpoint` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `checkpoint_order` to the `RouteCheckpoint` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "RouteCheckpoint_route_id_order_key";

-- AlterTable
ALTER TABLE "RouteCheckpoint" DROP COLUMN "order",
ADD COLUMN     "checkpoint_order" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RouteCheckpoint_route_id_checkpoint_order_key" ON "RouteCheckpoint"("route_id", "checkpoint_order");
