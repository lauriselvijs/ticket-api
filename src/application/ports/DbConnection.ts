import type { DbSession } from "./DbSession.ts";

export interface DbConnection {
  startSession(): Promise<DbSession>;
}
