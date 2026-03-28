import type { DbSession } from "../../../application/ports/DbSession.ts";
import Ticket from "../entities/Ticket.ts";
import type { NewTicket } from "../types/Ticket.ts";

export interface TicketRepository {
  create(ticket: NewTicket, session?: DbSession): Promise<Ticket>;
  findById(id: string): Promise<Ticket | null>;
  findAll(): Promise<Ticket[]>;
  update(ticket: Ticket, session?: DbSession): Promise<Ticket | null>;
  save(ticket: Ticket, session?: DbSession): Promise<void>;
}
