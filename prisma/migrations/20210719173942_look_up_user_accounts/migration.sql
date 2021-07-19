/*
  Warnings:

  - A unique constraint covering the columns `[providerId,userId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Account.providerId_userId_unique" ON "Account"("providerId", "userId");
