import { TicketStatus } from "../enums/TicketStatus.ts";

export type NewTicket = {
  title: string;
  description: string;
  status: TicketStatus;
};
