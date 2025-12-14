export const TicketStatus = {
  OPEN: "open",
  PENDING: "pending",
  CLOSED: "closed",
} as const;

export const TicketRoutingKeys = {
  CREATED: "tickets.created",
  UPDATED: "tickets.updated",
  DELETED: "tickets.deleted",
} as const;
