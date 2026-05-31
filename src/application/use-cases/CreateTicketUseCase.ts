import CreateTicketDto from "../dtos/CreateTicketDto.ts";
import Ticket from "../../domain/ticket/entities/Ticket.ts";
import type { DbConnection } from "../ports/DbConnection.ts";
import type { TicketRepository } from "../../domain/ticket/repositories/TicketRepository.ts";
import { TicketEventType } from "../../domain/ticket/enums/TicketEventType.ts";
import { TicketLifecycleChoreographySaga } from "../sagas/TicketLifecycleChoreographySaga.ts";

export default class CreateTicketUseCase {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly ticketLifecycleSaga: TicketLifecycleChoreographySaga,
    private readonly db: DbConnection,
  ) {}

  async execute(dto: CreateTicketDto) {
    return this.db.transaction(async (session) => {
      const ticket = Ticket.create(dto);

      const savedTicket = await this.ticketRepository.create(ticket, session);

      await this.ticketLifecycleSaga.record(
        TicketEventType.CREATED,
        savedTicket,
        session,
      );

      return savedTicket;
    });
  }
}
