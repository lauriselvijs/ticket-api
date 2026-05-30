import type { TicketRepository } from "../../domain/ticket/repositories/TicketRepository.ts";
import NotFoundError from "../errors/NotFoundError.ts";
import { deleteTicketDeletedEvent } from "../events/ticket/deleteTicketDeletedEvent.ts";
import type { DbConnection } from "../ports/DbConnection.ts";
import type { OutboxRepository } from "../ports/OutboxRepository.ts";

export class DeleteTicketUseCase {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly outboxRepository: OutboxRepository,
    private readonly db: DbConnection,
  ) {}

  async execute(id: string) {
    await this.db.transaction(async (session) => {
      const ticket = await this.ticketRepository.findById(id);

      if (!ticket) {
        throw new NotFoundError(`Ticket with id ${id} not found`);
      }

      ticket.delete();

      await this.ticketRepository.save(ticket, session);

      const event = deleteTicketDeletedEvent(ticket);

      await this.outboxRepository.create(event, session);
    });
  }
}
