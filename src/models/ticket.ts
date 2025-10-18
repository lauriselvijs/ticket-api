import mongoose from "mongoose";
import { ticketSchema } from "../db/schemas/tickets.ts";
import type { Ticket as TicketInterface } from "../db/schemas/tickets.ts";

export const Ticket = mongoose.model<TicketInterface>("Ticket", ticketSchema);
