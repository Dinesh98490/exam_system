import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
    // @ts-ignore: Force overriding datasource to ensure directConnection matches server config
    datasources: {
      db: {
        url: "mongodb://127.0.0.1:27017/exam-portal?directConnection=true",
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
