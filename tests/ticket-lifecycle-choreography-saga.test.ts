import { describe, it } from "node:test";
import assert from "node:assert/strict";
import Ticket from "../src/domain/ticket/entities/Ticket.ts";
import { TicketStatus } from "../src/domain/ticket/enums/TicketStatus.ts";
import { TicketEventType } from "../src/domain/ticket/enums/TicketEventType.ts";
import { OutboxStatus } from "../src/application/enums/OutboxStatus.ts";
import type OutboxEvent from "../src/application/events/OutboxEvent.ts";
import type { DbSession } from "../src/application/ports/DbSession.ts";
import type { OutboxRepository } from "../src/application/ports/OutboxRepository.ts";
import { TicketLifecycleChoreographySaga } from "../src/application/sagas/TicketLifecycleChoreographySaga.ts";

class InMemoryOutboxRepository implements OutboxRepository {
  readonly events: OutboxEvent[] = [];

  async create(event: OutboxEvent): Promise<void> {
    this.events.push(event);
  }

  async findPending(): Promise<OutboxEvent[]> {
    return this.events.filter((event) => event.status === OutboxStatus.PENDING);
  }

  async markAsPublished(): Promise<void> {}

  async markAsFailed(): Promise<void> {}

  async scheduleRetry(): Promise<void> {}
}

const session: DbSession = { type: "db-session" };

describe("ticket lifecycle choreography saga", () => {
  it("records created ticket event in the outbox", async () => {
    const outboxRepository = new InMemoryOutboxRepository();
    const saga = new TicketLifecycleChoreographySaga(outboxRepository);
    const ticket = Ticket.rehydrate(
      "ticket-1",
      "Created ticket",
      "Description",
      TicketStatus.OPEN,
      new Date("2026-05-31T00:00:00.000Z"),
      null,
    );

    await saga.record(TicketEventType.CREATED, ticket, session);

    assert.equal(outboxRepository.events.length, 1);
    assert.equal(outboxRepository.events[0]?.eventType, TicketEventType.CREATED);
    assert.equal(outboxRepository.events[0]?.aggregateId, "ticket-1");
  });

  it("records updated ticket event in the outbox", async () => {
    const outboxRepository = new InMemoryOutboxRepository();
    const saga = new TicketLifecycleChoreographySaga(outboxRepository);
    const ticket = Ticket.rehydrate(
      "ticket-1",
      "Updated ticket",
      "Description",
      TicketStatus.PENDING,
      new Date("2026-05-31T00:00:00.000Z"),
      null,
    );

    await saga.record(TicketEventType.UPDATED, ticket, session);

    assert.equal(outboxRepository.events.length, 1);
    assert.equal(outboxRepository.events[0]?.eventType, TicketEventType.UPDATED);
    assert.equal(outboxRepository.events[0]?.aggregateId, "ticket-1");
  });

  it("records deleted ticket event in the outbox", async () => {
    const outboxRepository = new InMemoryOutboxRepository();
    const saga = new TicketLifecycleChoreographySaga(outboxRepository);
    const ticket = Ticket.rehydrate(
      "ticket-1",
      "Deleted ticket",
      "Description",
      TicketStatus.CLOSED,
      new Date("2026-05-31T00:00:00.000Z"),
      new Date("2026-05-31T01:00:00.000Z"),
    );

    await saga.record(TicketEventType.DELETED, ticket, session);

    assert.equal(outboxRepository.events.length, 1);
    assert.equal(outboxRepository.events[0]?.eventType, TicketEventType.DELETED);
    assert.equal(outboxRepository.events[0]?.aggregateId, "ticket-1");
  });
});
