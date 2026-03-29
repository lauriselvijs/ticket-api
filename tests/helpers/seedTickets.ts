import { Ticket as TicketModel } from "../../src/infrastructure/persistence/mongo/models/ticket.ts";
import { randomUUID } from "crypto";
import { TicketStatus } from "../../src/domain/ticket/enums/TicketStatus.ts";

export async function seedTickets(count: number = 5) {
  const now = new Date();

  const tickets = Array.from({ length: count }).map((_, i) => ({
    id: randomUUID(),
    title: `Ticket ${i + 1}`,
    description: `Description ${i + 1}`,
    status: TicketStatus.OPEN,
    createdAt: now,
    deletedAt: null,
  }));

  await TicketModel.insertMany(tickets);

  return tickets;
}
