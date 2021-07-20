/*
  Warnings:

  - Added the required column `fileSize` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "fileSize" INTEGER NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;
