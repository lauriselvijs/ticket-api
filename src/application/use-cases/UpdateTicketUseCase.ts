import Ticket from "../../domain/ticket/entities/Ticket.ts";
import type { TicketRepository } from "../../domain/ticket/repositories/TicketRepository.ts";
import UpdateTicketDto from "../dtos/UpdateTicketDto.ts";
import NotFoundError from "../errors/NotFoundError.ts";
import { updateTicketUpdatedEvent } from "../events/ticket/updateTicketUpdatedEvent.ts";
import type { DbConnection } from "../ports/DbConnection.ts";
import type { OutboxRepository } from "../ports/OutboxRepository.ts";

export class UpdateTicketUseCase {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly outboxRepository: OutboxRepository,
    private readonly db: DbConnection,
  ) {}

  async execute(id: string, data: UpdateTicketDto): Promise<Ticket> {
    return this.db.transaction(async (session) => {
      const ticket = await this.ticketRepository.findById(id);

      if (!ticket) {
        throw new NotFoundError(`Ticket with id ${id} not found`);
      }

      const updatedTicket = ticket.update(data);

      const updated = await this.ticketRepository.update(ticket, session);

      if (!updated) {
        throw new NotFoundError("Ticket not found");
      }

      const event = updateTicketUpdatedEvent(updated);

      await this.outboxRepository.create(event, session);

      return updatedTicket;
    });
  }
}
