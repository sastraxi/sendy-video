import { PrismaClient } from "@prisma/client";

// Prevent multiple instances of Prisma Client in development
declare const global: NodeJS.Global & { prisma?: PrismaClient };

let prisma: PrismaClient;
if (!global.prisma) {
  prisma = new PrismaClient({
    log: [
      {
        emit: "event",
        level: "query",
      },
      {
        emit: "stdout",
        level: "error",
      },
      {
        emit: "stdout",
        level: "info",
      },
      {
        emit: "stdout",
        level: "warn",
      },
    ],
  });

  prisma.$on("query", (e) => {
    console.log("Query: " + e.query);
    console.log("Duration: " + e.duration + "ms");
  });

  if (process.env.NODE_ENV === "development") global.prisma = prisma;
} else {
  prisma = global.prisma;
}

export default prisma;
