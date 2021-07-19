/*
  Warnings:

  - Added the required column `driveFileId` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "driveFileId" TEXT;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "driveFileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "driveFileId" TEXT;
