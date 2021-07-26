-- CreateTable
CREATE TABLE "AccessToken" (
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),

    PRIMARY KEY ("token")
);
