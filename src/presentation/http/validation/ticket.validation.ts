import { z } from "zod";
import { TicketStatus } from "../../../domain/ticket/enums/TicketStatus.ts";

export const createTicketSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(Object.values(TicketStatus)),
});

export const updateTicketSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(Object.values(TicketStatus)),
});
