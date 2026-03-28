import { TicketStatus } from "../enums/TicketStatus.ts";

export type UpdateTicket = {
  title: string;
  description: string;
  status: TicketStatus;
};
