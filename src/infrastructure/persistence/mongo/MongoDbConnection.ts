import mongoose from "mongoose";
import type { DbConnection } from "../../../application/ports/DbConnection.ts";
import type { DbSession } from "../../../application/ports/DbSession.ts";
import { MongoDbSession } from "./MongoDbSession.ts";

export class MongoDbConnection implements DbConnection {
  async startSession(): Promise<DbSession> {
    const session = await mongoose.startSession();
    return new MongoDbSession(session);
  }
}
