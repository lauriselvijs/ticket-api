import { z } from "zod";
import { TicketStatus } from "../enums/tickets.ts";

export const ticketSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(Object.values(TicketStatus)),
});

export type Ticket = z.infer<typeof ticketSchema>;
