import { OutboxRepository } from "../../../application/ports/OutboxRepository.ts";
import { OutboxEvent } from "../../../application/events/OutboxEvent.ts";
import prisma from "./prisma.client.ts";

export class PrismaOutboxRepository implements OutboxRepository {
  async create(event: OutboxEvent): Promise<void> {
    await prisma.outbox.create({
      data: {
        id: event.id,
        aggregateId: event.aggregateId,
        eventType: event.eventType,
        payload: event.payload,
        status: event.status,
      },
    });
  }

  async findPending(): Promise<OutboxEvent[]> {
    const events = await prisma.outbox.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
    });
    return events.map((e) => ({
      id: e.id,
      aggregateId: e.aggregateId,
      eventType: e.eventType,
      payload: e.payload as Record<string, any>,
      status: e.status,
      createdAt: e.createdAt,
    }));
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await prisma.outbox.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.outbox.delete({
      where: { id },
    });
  }
}
