import { DbSession } from "../../../application/ports/DbSession.ts";
import prisma from "./prisma.client.ts";

export class PrismaDbSession implements DbSession {
  private inTransaction = false;

  startTransaction(): void {
    this.inTransaction = true;
  }

  async commitTransaction(): Promise<void> {
    // Prisma transactions are handled automatically in the use case
    this.inTransaction = false;
  }

  async abortTransaction(): Promise<void> {
    // Prisma transactions are rolled back automatically on error
    this.inTransaction = false;
  }

  endSession(): void {
    // No need to explicitly end session with Prisma
  }

  isInTransaction(): boolean {
    return this.inTransaction;
  }
}
