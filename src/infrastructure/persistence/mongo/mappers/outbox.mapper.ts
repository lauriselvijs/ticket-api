import { AggregateType } from "../../../../application/enums/AggregateType.ts";
import OutboxEvent from "../../../../application/events/OutboxEvent.ts";
import { OutboxDocument } from "../types/OutboxDocument.ts";

export const toOutboxEvent = (doc: OutboxDocument): OutboxEvent => {
  return new OutboxEvent(
    doc.id,
    doc.aggregateId,
    doc.aggregateType as AggregateType,
    doc.eventType,
    doc.payload,
    doc.occurredAt,
    doc.status,
    doc.publishedAt,
    doc.errorMessage,
    doc.retryCount,
  );
};
