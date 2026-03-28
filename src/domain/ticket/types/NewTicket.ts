import { NewTicket } from "./Ticket.ts";

export type Ticket = NewTicket & {
  id: string;
  createdAt: Date;
};
