import type { DbConnection } from "../../../application/ports/DbConnection.ts";
import type { DbSession } from "../../../application/ports/DbSession.ts";
import { PrismaDbSession } from "./PrismaDbSession.ts";
import prisma from "./prisma.client.ts";

export class PrismaDbConnection implements DbConnection {
  async transaction<T>(
    operation: (session: DbSession) => Promise<T>,
  ): Promise<T> {
    return prisma.$transaction((tx) => operation(new PrismaDbSession(tx)));
  }
}
