/*
  Warnings:

  - You are about to drop the column `event_id` on the `Penalty` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Penalty" DROP CONSTRAINT "Penalty_event_id_fkey";

-- AlterTable
ALTER TABLE "Penalty" DROP COLUMN "event_id";
