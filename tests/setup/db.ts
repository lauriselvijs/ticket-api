import { before, beforeEach, after } from "node:test";
import {
  connectDb,
  closeDb,
  getDb,
} from "../../src/infrastructure/db/prisma/prisma.connection.ts";

before(async () => {
  await connectDb();
});

beforeEach(async () => {
  const db = getDb();
  await db.outbox.deleteMany();
  await db.ticket.deleteMany();
});

after(async () => {
  await closeDb();
});
