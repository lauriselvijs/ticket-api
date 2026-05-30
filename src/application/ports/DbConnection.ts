import type { DbSession } from "./DbSession.ts";

export interface DbConnection {
  transaction<T>(operation: (session: DbSession) => Promise<T>): Promise<T>;
}
