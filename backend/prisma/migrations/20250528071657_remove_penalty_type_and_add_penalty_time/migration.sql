/*
  Warnings:

  - You are about to drop the column `penalty_type_id` on the `Penalty` table. All the data in the column will be lost.
  - You are about to drop the `PenaltyType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `time` to the `Penalty` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Penalty" DROP CONSTRAINT "Penalty_penalty_type_id_fkey";

-- DropForeignKey
ALTER TABLE "PenaltyType" DROP CONSTRAINT "PenaltyType_event_id_fkey";

-- AlterTable
ALTER TABLE "Penalty" DROP COLUMN "penalty_type_id",
ADD COLUMN     "time" INTEGER NOT NULL;

-- DropTable
DROP TABLE "PenaltyType";
