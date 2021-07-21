/*
  Warnings:

  - You are about to drop the column `driveFileId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `driveFileId` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `driveFileId` on the `User` table. All the data in the column will be lost.
  - Added the required column `folderFileId` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isOpen` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileId` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "driveFileId",
ADD COLUMN     "closesAt" TIMESTAMP(3),
ADD COLUMN     "folderFileId" TEXT NOT NULL,
ADD COLUMN     "isOpen" BOOLEAN NOT NULL,
ADD COLUMN     "maxBytes" INTEGER,
ADD COLUMN     "maxSubmissions" INTEGER,
ADD COLUMN     "ssoDomain" TEXT,
ADD COLUMN     "ssoEnforced" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ssoMaxSubmissions" INTEGER,
ADD COLUMN     "ssoSharedVideos" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "driveFileId",
ADD COLUMN     "fileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "driveFileId",
ADD COLUMN     "rootFileId" TEXT;
