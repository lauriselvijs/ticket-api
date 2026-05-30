import { getDb } from "../../src/infrastructure/db/prisma/prisma.connection.ts";
import { randomUUID } from "crypto";
import { TicketStatus } from "../../src/domain/ticket/enums/TicketStatus.ts";

export async function seedTickets(count: number = 5) {
  const db = getDb();
  const now = new Date();

  const tickets = Array.from({ length: count }).map((_, i) => ({
    id: randomUUID(),
    title: `Ticket ${i + 1}`,
    description: `Description ${i + 1}`,
    status: TicketStatus.OPEN,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  }));

  const created = await Promise.all(
    tickets.map((t) => db.ticket.create({ data: t })),
  );

  return created;
}
