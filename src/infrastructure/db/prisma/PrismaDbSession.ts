import type { Prisma } from "../../../../generated/prisma/client.ts";
import type { DbSession } from "../../../application/ports/DbSession.ts";

export class PrismaDbSession implements DbSession {
  readonly type: "db-session" = "db-session";

  constructor(readonly client: Prisma.TransactionClient) {}
}
