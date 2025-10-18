import { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import type { Ticket as TicketType } from "../../schemas/tickets.ts";
import { TicketStatus } from "../../enums/tickets.ts";

export interface Ticket extends TicketType, Document {
  id: string;
}

export const ticketSchema: Schema = new Schema<Ticket>(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: { type: String, enum: Object.values(TicketStatus), required: true },
  },
  {
    timestamps: true,
  }
);

ticketSchema.set("toJSON", {
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;

    return ret;
  },
});
