/*
  Warnings:

  - Added the required column `metadata` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "metadata" JSONB NOT NULL;
