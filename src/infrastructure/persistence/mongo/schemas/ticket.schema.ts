import { Schema } from "mongoose";
import { TicketStatus } from "../../../../domain/ticket/enums/TicketStatus.ts";

export const ticketSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: Object.values(TicketStatus),
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});
