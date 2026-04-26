import { OutboxStatus } from "../../../../application/enums/OutboxStatus.ts";
import OutboxEvent from "../../../../application/events/OutboxEvent.ts";
import type { DbSession } from "../../../../application/ports/DbSession.ts";
import type { OutboxRepository } from "../../../../application/ports/OutboxRepository.ts";
import { toOutboxEvent } from "../mappers/outbox.mapper.ts";
import { Outbox } from "../models/outbox.ts";
import { MongoDbSession } from "../MongoDbSession.ts";

export class MongoOutboxRepository implements OutboxRepository {
  async create(event: OutboxEvent, session?: DbSession): Promise<void> {
    if (!(session instanceof MongoDbSession)) {
      throw new Error("Mongo adapter requires MongoDbSession");
    }

    await Outbox.create([event], { session: session.raw });
  }

  async findPending(limit = 100): Promise<OutboxEvent[]> {
    const events = await Outbox.find({
      status: OutboxStatus.PENDING,
      $or: [{ nextRetryAt: null }, { nextRetryAt: { $lte: new Date() } }],
    })
      .sort({ occurredAt: 1 })
      .limit(limit)
      .lean();

    return events.map(toOutboxEvent);
  }

  async markAsPublished(eventId: string): Promise<void> {
    await Outbox.updateOne(
      { id: eventId },
      {
        $set: {
          status: OutboxStatus.PUBLISHED,
          publishedAt: new Date(),
          errorMessage: null,
          nextRetryAt: null,
          lastAttemptAt: new Date(),
        },
      },
    );
  }

  async markAsFailed(eventId: string, error?: string): Promise<void> {
    await Outbox.updateOne(
      { id: eventId },
      {
        $set: {
          status: OutboxStatus.FAILED,
          errorMessage: error ?? null,
          lastAttemptAt: new Date(),
        },
        $inc: {
          retryCount: 1,
        },
      },
    );
  }

  async scheduleRetry(
    eventId: string,
    error: string,
    nextRetryAt: Date,
  ): Promise<void> {
    await Outbox.updateOne(
      { id: eventId },
      {
        $set: {
          setStatus: OutboxStatus.PENDING,
          errorMessage: error,
          nextRetryAt,
          lastAttemptAt: new Date(),
        },
        $inc: {
          retryCount: 1,
        },
      },
    );
  }
}
