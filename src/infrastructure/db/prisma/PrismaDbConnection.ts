import { DbConnection } from "../../../application/ports/DbConnection.ts";
import { DbSession } from "../../../application/ports/DbSession.ts";
import { PrismaDbSession } from "./PrismaDbSession.ts";

export class PrismaDbConnection implements DbConnection {
  async startSession(): Promise<DbSession> {
    return new PrismaDbSession();
  }
}
