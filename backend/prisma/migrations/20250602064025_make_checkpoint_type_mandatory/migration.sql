/*
  Warnings:

  - Made the column `type` on table `Checkpoint` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Checkpoint" ALTER COLUMN "type" SET NOT NULL;
