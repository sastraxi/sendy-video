/*
  Warnings:

  - You are about to drop the column `name` on the `Submission` table. All the data in the column will be lost.
  - Added the required column `title` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL;
