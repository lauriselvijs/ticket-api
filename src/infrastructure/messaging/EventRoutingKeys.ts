import { TicketEventType } from "../../domain/ticket/enums/TicketEventType.ts";

export const ticketEventRoutingKeyMap = {
  [TicketEventType.CREATED]: "tickets.created",
  [TicketEventType.UPDATED]: "tickets.updated",
  [TicketEventType.DELETED]: "tickets.deleted",
} as const;
