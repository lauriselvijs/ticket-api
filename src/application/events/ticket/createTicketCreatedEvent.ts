import OutboxEvent from "../OutboxEvent.ts";
import Ticket from "../../../domain/ticket/entities/Ticket.ts";
import { TicketEventType } from "../../../domain/ticket/enums/TicketEventType.ts";
import { AggregateType } from "../../enums/AggregateType.ts";

export const createTicketCreatedEvent = (ticket: Ticket): OutboxEvent => {
  return new OutboxEvent(
    crypto.randomUUID(),
    ticket.id,
    AggregateType.TICKET,
    TicketEventType.CREATED,
    {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      createdAt: ticket.createdAt,
    },
    new Date(),
  );
};
