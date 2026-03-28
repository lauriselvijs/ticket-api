import { Schema } from "mongoose";
import { OutboxStatus } from "../../../../application/enums/OutboxStatus.ts";
import { OutboxDocument } from "../types/OutboxDocument.ts";

export const outboxSchema = new Schema<OutboxDocument>(
  {
    id: { type: String, required: true, unique: true },
    aggregateId: { type: String, required: true },
    aggregateType: { type: String, required: true },
    eventType: { type: String, required: true },
    payload: { type: Schema.Types.Mixed, required: true },
    occurredAt: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(OutboxStatus),
      default: OutboxStatus.PENDING,
    },
    publishedAt: { type: Date, default: null },
    errorMessage: { type: String, default: null },
    retryCount: { type: Number, required: true, default: 0 },
    nextRetryAt: { type: Date, default: null },
    lastAttemptAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
);
