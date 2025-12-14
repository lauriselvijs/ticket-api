import { ticketFactory } from "../factories/ticket.ts";

const seedTickets = async (count = 10) => {
  const tickets = [];

  for (let i = 0; i < count; i++) {
    tickets.push(await ticketFactory());
  }

  return tickets;
};

export { seedTickets };
