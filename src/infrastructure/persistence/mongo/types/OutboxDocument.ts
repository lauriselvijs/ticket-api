// infrastructure/database/mongo/types/outbox.ts

import { AggregateType } from "../../../../application/enums/AggregateType.ts";
import { OutboxStatus } from "../../../../application/enums/OutboxStatus.ts";

export interface OutboxDocument {
  id: string;
  aggregateId: string;
  aggregateType: AggregateType;
  eventType: string;
  payload: Record<string, unknown>;
  occurredAt: Date;
  status: OutboxStatus;
  publishedAt: Date | null;
  errorMessage: string | null;
  retryCount: number;
  nextRetryAt: Date | null;
  lastAttemptAt: Date | null;
}
