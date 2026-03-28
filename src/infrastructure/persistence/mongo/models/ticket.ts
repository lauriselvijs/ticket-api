import mongoose from "mongoose";
import { ticketSchema } from "../schemas/ticket.schema.ts";

export const Ticket = mongoose.model("Ticket", ticketSchema);
