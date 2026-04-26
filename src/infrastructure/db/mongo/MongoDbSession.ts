import type { ClientSession } from "mongoose";
import type { DbSession } from "../../../application/ports/DbSession.ts";

export class MongoDbSession implements DbSession {
  constructor(private readonly session: ClientSession) {}

  startTransaction(): void {
    this.session.startTransaction();
  }

  async commitTransaction(): Promise<void> {
    await this.session.commitTransaction();
  }

  async abortTransaction(): Promise<void> {
    await this.session.abortTransaction();
  }

  async endSession(): Promise<void> {
    await this.session.endSession();
  }

  get raw(): ClientSession {
    return this.session;
  }
}
