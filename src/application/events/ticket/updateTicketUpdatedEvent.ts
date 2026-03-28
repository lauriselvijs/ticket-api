import Ticket from "../../../domain/ticket/entities/Ticket.ts";
import { TicketEventType } from "../../../domain/ticket/enums/TicketEventType.ts";
import { AggregateType } from "../../enums/AggregateType.ts";
import OutboxEvent from "../OutboxEvent.ts";

export const updateTicketUpdatedEvent = (ticket: Ticket): OutboxEvent => {
  return new OutboxEvent(
    crypto.randomUUID(),
    ticket.id,
    AggregateType.TICKET,
    TicketEventType.UPDATED,
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
