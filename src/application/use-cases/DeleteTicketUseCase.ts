import type { TicketRepository } from "../../domain/ticket/repositories/TicketRepository.ts";
import NotFoundError from "../errors/NotFoundError.ts";
import type { DbConnection } from "../ports/DbConnection.ts";
import { TicketEventType } from "../../domain/ticket/enums/TicketEventType.ts";
import { TicketLifecycleChoreographySaga } from "../sagas/TicketLifecycleChoreographySaga.ts";

export class DeleteTicketUseCase {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly ticketLifecycleSaga: TicketLifecycleChoreographySaga,
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

      await this.ticketLifecycleSaga.record(
        TicketEventType.DELETED,
        ticket,
        session,
      );
    });
  }
}
