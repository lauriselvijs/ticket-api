import { TicketStatus } from "../enums/tickets.ts";
import type { TicketStatus as TicketStatusType } from "../types/tickets.ts";

const statuses = Object.values(TicketStatus);

const randomStatus = (): TicketStatusType => {
  return statuses[Math.floor(Math.random() * statuses.length)];
};

export { randomStatus };
