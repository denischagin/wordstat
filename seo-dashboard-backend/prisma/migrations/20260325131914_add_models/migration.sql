/*
  Warnings:

  - Added the required column `count` to the `PhraseStat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `PhraseStat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PhraseStat" ADD COLUMN     "count" INTEGER NOT NULL,
ADD COLUMN     "date" TEXT NOT NULL;
