/*
  Warnings:

  - Added the required column `commentary` to the `MainInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mainImage` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MainInfo" ADD COLUMN     "commentary" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "mainImage" TEXT NOT NULL;
