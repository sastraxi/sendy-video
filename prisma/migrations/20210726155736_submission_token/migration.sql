/*
  Warnings:

  - The required column `updateToken` was added to the `Submission` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "updateToken" TEXT NOT NULL;