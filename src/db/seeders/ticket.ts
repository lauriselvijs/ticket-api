import { ticketFactory } from "../factories/ticket.ts";

export async function seedTickets(count = 10) {
  const tickets = [];

  for (let i = 0; i < count; i++) {
    tickets.push(await ticketFactory());
  }

  return tickets;
}
