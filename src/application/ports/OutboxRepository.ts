import type OutboxEvent from "../events/OutboxEvent.ts";
import type { DbSession } from "./DbSession.ts";

export interface OutboxRepository {
  create(event: OutboxEvent, session?: DbSession): Promise<void>;
  findPending(limit?: number): Promise<OutboxEvent[]>;
  markAsPublished(eventId: string): Promise<void>;
  markAsFailed(eventId: string, error?: string): Promise<void>;
  scheduleRetry(
    eventId: string,
    error: string,
    nextRetryAt: Date,
  ): Promise<void>;
}
