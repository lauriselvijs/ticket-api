import type { Prisma } from "../../../../../generated/prisma/client.ts";
import { AggregateType } from "../../../../application/enums/AggregateType.ts";
import { OutboxStatus } from "../../../../application/enums/OutboxStatus.ts";
import OutboxEvent from "../../../../application/events/OutboxEvent.ts";
import type { DbSession } from "../../../../application/ports/DbSession.ts";
import type { OutboxRepository } from "../../../../application/ports/OutboxRepository.ts";
import { PrismaDbSession } from "../PrismaDbSession.ts";
import prisma from "../prisma.client.ts";

type PrismaClientLike = typeof prisma | PrismaDbSession["client"];

const getClient = (session?: DbSession): PrismaClientLike => {
  if (!session) return prisma;

  if (!(session instanceof PrismaDbSession)) {
    throw new Error("Prisma adapter requires PrismaDbSession");
  }

  return session.client;
};

export class PrismaOutboxRepository implements OutboxRepository {
  async create(event: OutboxEvent, session?: DbSession): Promise<void> {
    const client = getClient(session);
    await client.outbox.create({
      data: {
        id: event.id,
        aggregateId: event.aggregateId,
        eventType: event.eventType,
        payload: event.payload as Prisma.InputJsonValue,
        status: event.status,
      },
    });
  }

  async findPending(limit = 100): Promise<OutboxEvent[]> {
    const events = await prisma.outbox.findMany({
      where: { status: OutboxStatus.PENDING },
      orderBy: { createdAt: "asc" },
      take: limit,
    });
    return events.map(
      (event) =>
        new OutboxEvent(
          event.id,
          event.aggregateId,
          AggregateType.TICKET,
          event.eventType,
          event.payload as Record<string, unknown>,
          event.createdAt,
          event.status as OutboxStatus,
        ),
    );
  }

  async markAsPublished(id: string): Promise<void> {
    await prisma.outbox.update({
      where: { id },
      data: { status: OutboxStatus.PUBLISHED },
    });
  }

  async markAsFailed(id: string, _error?: string): Promise<void> {
    await prisma.outbox.update({
      where: { id },
      data: { status: OutboxStatus.FAILED },
    });
  }

  async scheduleRetry(
    id: string,
    _error: string,
    _nextRetryAt: Date,
  ): Promise<void> {
    await prisma.outbox.update({
      where: { id },
      data: { status: OutboxStatus.PENDING },
    });
  }
}
