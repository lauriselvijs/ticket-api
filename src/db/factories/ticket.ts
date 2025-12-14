import { Ticket } from "../../models/ticket.ts";
import type { TicketStatus } from "../../types/tickets.ts";
import { randomStatus } from "../../util/faker.ts";

type TicketOverrides = Partial<{
  title: string;
  description: string;
  status: TicketStatus;
}>;

const ticketFactory = (overrides: TicketOverrides = {}) => {
  return Ticket.create({
    title: "Default title",
    description: "Default description",
    status: randomStatus(),
    ...overrides,
  });
};

export { ticketFactory };
