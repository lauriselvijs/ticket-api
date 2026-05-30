import { PrismaClient } from "@prisma/client";
import { databaseConfig } from "./database.config.ts";

const prismaOptions = {
  datasources: {
    db: {
      url: databaseConfig.url,
    },
  },
};

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient(prismaOptions);
} else {
  let globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient(prismaOptions);
  }
  prisma = globalWithPrisma.prisma;
}

export default prisma;
