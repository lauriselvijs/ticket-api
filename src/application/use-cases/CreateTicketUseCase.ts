import CreateTicketDto from "../dtos/CreateTicketDto.ts";
import type { OutboxRepository } from "../ports/OutboxRepository.ts";
import Ticket from "../../domain/ticket/entities/Ticket.ts";
import type { DbConnection } from "../ports/DbConnection.ts";
import type { TicketRepository } from "../../domain/ticket/repositories/TicketRepository.ts";
import { createTicketCreatedEvent } from "../events/ticket/createTicketCreatedEvent.ts";

export default class CreateTicketUseCase {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly outboxRepository: OutboxRepository,
    private readonly db: DbConnection,
  ) {}

  async execute(dto: CreateTicketDto) {
    const session = await this.db.startSession();

    try {
      session.startTransaction();

      const ticket = Ticket.create(dto);

      const savedTicket = await this.ticketRepository.create(ticket, session);

      const event = createTicketCreatedEvent(savedTicket);

      await this.outboxRepository.create(event, session);

      await session.commitTransaction();

      return savedTicket;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
  }
}
