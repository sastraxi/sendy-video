/*
  Warnings:

  - You are about to drop the column `magicLink` on the `Project` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[magicCode]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `magicCode` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Project.magicLink_unique";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "magicLink",
ADD COLUMN     "magicCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Project.magicCode_unique" ON "Project"("magicCode");
