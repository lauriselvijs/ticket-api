import { describe, it, beforeEach, before } from "node:test";
import request from "supertest";
import assert from "node:assert/strict";
import { TicketStatus } from "../src/domain/ticket/enums/TicketStatus.ts";
import { StatusCodes } from "http-status-codes";
import { route } from "../src/presentation/http/routes/util/routes.ts";
import "./setup/mongo.ts";
import { Ticket } from "../src/infrastructure/persistence/mongo/models/ticket.ts";
import { seedTickets } from "./helpers/seedTickets.ts";
import { randomUUID } from "node:crypto";
import { Outbox } from "../src/infrastructure/persistence/mongo/models/outbox.ts";
import { TicketEventType } from "../src/domain/ticket/enums/TicketEventType.ts";
import { OutboxStatus } from "../src/application/enums/OutboxStatus.ts";

if (!process.env.MONGO_INITDB_DATABASE?.includes("test")) {
  throw new Error(
    `Refusing to run tests: ${process.env.MONGO_INITDB_DATABASE} is not a test database`,
  );
}

let app: any;

describe("tickets", () => {
  before(async () => {
    const { createApp } = await import("../src/app.ts");
    app = createApp();
  });

  it("GET /tickets returns all tickets", async () => {
    await seedTickets(10);

    const res = await request(app).get(route("/tickets"));

    assert.equal(res.status, StatusCodes.OK);
    assert.equal(res.body.length, 10);
  });

  it("GET /tickets returns 404 when there are no tickets", async () => {
    const res = await request(app).get(route("/tickets"));

    assert.equal(res.status, StatusCodes.OK);
    assert.equal(res.body.length, 0);
  });

  it("GET /tickets/:id returns a ticket when found", async () => {
    const [ticket] = await seedTickets(1);

    const res = await request(app).get(route(`/tickets/${ticket.id}`));

    assert.equal(res.status, StatusCodes.OK);
    assert.equal(res.body.id, ticket.id);
    assert.equal(res.body.title, ticket.title);
    assert.equal(res.body.description, ticket.description);
    assert.equal(res.body.status, ticket.status);
  });

  it("GET /tickets/:id returns 404 when ticket not found", async () => {
    const missingId = randomUUID();

    const res = await request(app).get(route(`/tickets/${missingId}`));

    assert.equal(res.status, StatusCodes.NOT_FOUND);
    assert.equal(res.body.message, `Ticket with id ${missingId} not found`);
  });

  it("POST /tickets creates a ticket and publishes CREATED event", async (t) => {
    const payload = {
      title: "New ticket",
      description: "Some description",
      status: TicketStatus.OPEN,
    };

    const res = await request(app)
      .post(route("/tickets"))
      .send(payload)
      .set("Content-Type", "application/json");

    assert.equal(res.status, StatusCodes.CREATED);

    const created = res.body;
    assert.equal(created.title, payload.title);
    assert.equal(created.description, payload.description);
    assert.equal(created.status, TicketStatus.OPEN);

    const ticket = await Ticket.findOne({ id: created.id });
    assert.ok(ticket);
    assert.equal(ticket!.title, payload.title);

    const messages = await Outbox.find({ aggregateId: created.id });

    assert.equal(
      messages.length,
      1,
      "Should create exactly one outbox message",
    );

    const outboxMessage = messages[0];

    assert.ok(outboxMessage, "Outbox message should exist");

    assert.equal(outboxMessage.aggregateId, created.id);
    assert.equal(outboxMessage.eventType, TicketEventType.CREATED);

    assert.equal(outboxMessage.payload.id, created.id);
    assert.equal(outboxMessage.payload.title, payload.title);
    assert.equal(outboxMessage.payload.description, payload.description);

    assert.equal(outboxMessage.status, OutboxStatus.PENDING);
  });

  it("PUT /tickets/:id updates a ticket and publishes UPDATED event", async () => {
    const [ticket] = await seedTickets(1);

    const updatePayload = {
      title: "Updated title",
      description: "Updated desc",
      status: TicketStatus.CLOSED,
    };

    const res = await request(app)
      .put(route(`/tickets/${ticket.id}`))
      .send(updatePayload)
      .set("Content-Type", "application/json");

    assert.equal(res.status, StatusCodes.OK);
    assert.equal(res.body.title, updatePayload.title);
    assert.equal(res.body.description, updatePayload.description);
    assert.equal(res.body.status, updatePayload.status);

    const updated = await Ticket.findOne({ id: ticket.id });
    assert.ok(updated);
    assert.equal(updated!.title, updatePayload.title);
    assert.equal(updated!.status, updatePayload.status);

    const messages = await Outbox.find({ aggregateId: updated.id });

    assert.equal(
      messages.length,
      1,
      "Should create exactly one outbox message",
    );

    const outboxMessage = messages[0];

    assert.ok(outboxMessage, "Outbox message should exist");

    assert.equal(outboxMessage.aggregateId, updated.id);
    assert.equal(outboxMessage.eventType, TicketEventType.UPDATED);

    assert.equal(outboxMessage.payload.id, updated.id);
    assert.equal(outboxMessage.payload.title, updatePayload.title);
    assert.equal(outboxMessage.payload.description, updatePayload.description);

    assert.equal(outboxMessage.status, OutboxStatus.PENDING);
  });

  it("PUT /tickets/:id returns 404 when ticket not found", async () => {
    const missingId = randomUUID();

    const res = await request(app)
      .put(route(`/tickets/${missingId}`))
      .send({ title: "x", description: "y", status: TicketStatus.OPEN })
      .set("Content-Type", "application/json");

    assert.equal(res.status, StatusCodes.NOT_FOUND);
    assert.equal(res.body.message, `Ticket with id ${missingId} not found`);

    const messages = await Outbox.find({ aggregateId: missingId });

    assert.equal(messages.length, 0, "Should not create any outbox messages");
  });

  it("DELETE /tickets/:id deletes ticket and publishes DELETED event", async () => {
    const [ticket] = await seedTickets(1);

    const res = await request(app).delete(route(`/tickets/${ticket.id}`));

    assert.equal(res.status, StatusCodes.NO_CONTENT);

    const deletedTicket = await Ticket.findOne({
      id: ticket.id,
      deletedAt: null,
    });
    assert.equal(deletedTicket, null);

    const messages = await Outbox.find({ aggregateId: ticket.id });

    assert.equal(
      messages.length,
      1,
      "Should create exactly one outbox message",
    );

    const outboxMessage = messages[0];

    assert.ok(outboxMessage, "Outbox message should exist");

    assert.equal(outboxMessage.aggregateId, ticket.id);
    assert.equal(outboxMessage.eventType, TicketEventType.DELETED);

    assert.equal(outboxMessage.payload.id, ticket.id);
    assert.equal(outboxMessage.payload.title, ticket.title);
    assert.equal(outboxMessage.payload.description, ticket.description);

    assert.equal(outboxMessage.status, OutboxStatus.PENDING);
  });

  it("DELETE /tickets/:id returns 404 when ticket not found", async () => {
    const missingId = randomUUID();

    const res = await request(app).delete(route(`/tickets/${missingId}`));

    assert.equal(res.status, StatusCodes.NOT_FOUND);
    assert.equal(res.body.message, `Ticket with id ${missingId} not found`);

    const messages = await Outbox.find({ aggregateId: missingId });

    assert.equal(messages.length, 0, "Should not create any outbox messages");
  });
});
