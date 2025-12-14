import { Ticket } from "../../models/ticket.ts";
import type { TicketStatus } from "../../types/tickets.ts";
import { randomStatus } from "../../util/faker.ts";

export type TicketOverrides = Partial<{
  title: string;
  description: string;
  status: TicketStatus;
}>;

export async function ticketFactory(overrides: TicketOverrides = {}) {
  return Ticket.create({
    title: "Default title",
    description: "Default description",
    status: randomStatus(),
    ...overrides,
  });
}
