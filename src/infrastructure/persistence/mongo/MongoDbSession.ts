import { ClientSession } from "mongoose";
import { DbSession } from "../../../application/ports/DbSession.ts";

export class MongoDbSession implements DbSession {
  constructor(private readonly session: ClientSession) {}

  startTransaction() {
    this.session.startTransaction();
  }

  commitTransaction() {
    return this.session.commitTransaction();
  }

  abortTransaction() {
    return this.session.abortTransaction();
  }

  endSession() {
    this.session.endSession();
  }

  get raw(): ClientSession {
    return this.session;
  }
}
