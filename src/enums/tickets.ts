export const TicketStatus = {
  OPEN: "open",
  PENDING: "pending",
  CLOSED: "closed",
} as const;

export const TicketRoutingKeys = {
  CREATED: "ticket.created",
  UPDATED: "ticket.updated",
  DELETED: "ticket.deleted",
} as const;
