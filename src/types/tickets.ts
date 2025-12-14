import { TicketStatus } from "../enums/tickets.ts";

export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus];
