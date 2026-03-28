import { de } from "zod/locales";
import Ticket from "../../../domain/ticket/entities/Ticket.ts";
import { TicketEventType } from "../../../domain/ticket/enums/TicketEventType.ts";
import { AggregateType } from "../../enums/AggregateType.ts";
import OutboxEvent from "../OutboxEvent.ts";

export const deleteTicketDeletedEvent = (ticket: Ticket): OutboxEvent => {
  return new OutboxEvent(
    crypto.randomUUID(),
    ticket.id,
    AggregateType.TICKET,
    TicketEventType.DELETED,
    {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      createdAt: ticket.createdAt,
      deletedAt: ticket.deletedAt,
    },
    new Date(),
  );
};
