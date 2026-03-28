import { DbSession } from "./DbSession.ts";

export interface DbConnection {
  startSession(): Promise<DbSession>;
}
