/*
  Warnings:

  - Added the required column `webLink` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "webLink" TEXT NOT NULL;
