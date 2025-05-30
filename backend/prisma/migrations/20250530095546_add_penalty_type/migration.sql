/*
  Warnings:

  - Added the required column `type` to the `Penalty` table without a default value. This is not possible if the table is not empty.
  - Made the column `checkpoint_id` on table `Penalty` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "PenaltyType" AS ENUM ('HINT', 'SKIP', 'OVERTIME');

-- AlterTable
ALTER TABLE "Penalty" ADD COLUMN     "type" "PenaltyType" NOT NULL,
ALTER COLUMN "checkpoint_id" SET NOT NULL;
