import Ticket from "../../domain/ticket/entities/Ticket.ts";
import { TicketEventType } from "../../domain/ticket/enums/TicketEventType.ts";
import { createTicketCreatedEvent } from "../events/ticket/createTicketCreatedEvent.ts";
import { deleteTicketDeletedEvent } from "../events/ticket/deleteTicketDeletedEvent.ts";
import { updateTicketUpdatedEvent } from "../events/ticket/updateTicketUpdatedEvent.ts";
import type OutboxEvent from "../events/OutboxEvent.ts";
import type { DbSession } from "../ports/DbSession.ts";
import type { OutboxRepository } from "../ports/OutboxRepository.ts";

type TicketEventFactory = (ticket: Ticket) => OutboxEvent;

export class TicketLifecycleChoreographySaga {
  private readonly eventFactories: Record<TicketEventType, TicketEventFactory> =
    {
      [TicketEventType.CREATED]: createTicketCreatedEvent,
      [TicketEventType.UPDATED]: updateTicketUpdatedEvent,
      [TicketEventType.DELETED]: deleteTicketDeletedEvent,
    };

  constructor(private readonly outboxRepository: OutboxRepository) {}

  async record(
    eventType: TicketEventType,
    ticket: Ticket,
    session: DbSession,
  ): Promise<void> {
    const event = this.eventFactories[eventType](ticket);

    await this.outboxRepository.create(event, session);
  }
}
