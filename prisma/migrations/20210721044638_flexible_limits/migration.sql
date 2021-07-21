/*
  Warnings:

  - You are about to drop the column `maxBytes` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "maxBytes",
ADD COLUMN     "maxBytesTotal" INTEGER,
ADD COLUMN     "maxSubmissionBytes" INTEGER,
ADD COLUMN     "maxSubmissionLength" INTEGER;
