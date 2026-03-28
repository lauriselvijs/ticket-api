import { describe, it, mock, beforeEach, before } from "node:test";
import request from "supertest";
import assert from "node:assert/strict";
import {
  TicketRoutingKeys,
  TicketStatus,
} from "../src/domain/ticket/enums/TicketStatus.ts";
import { StatusCodes } from "http-status-codes";
import { route } from "../src/presentation/http/routes/util/routes.ts";
import { v4 as uuidv4 } from "uuid";

import "./setup/mongo.ts";
import { Ticket } from "../src/infrastructure/persistence/mongo/models/ticket.ts";
import { seedTickets } from "../src/infrastructure/persistence/seeders/ticket.ts";
import { publishToRabbitMock } from "./mocks/rabbit.ts";

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

  beforeEach(() => {
    publishToRabbitMock.mock.resetCalls();
  });

  it("GET /tickets returns all tickets", async () => {
    await seedTickets(10);

    const res = await request(app).get(route("/tickets"));

    assert.equal(res.status, StatusCodes.OK);
    assert.equal(res.body.tickets.length, 10);
  });

  it("GET /tickets returns 404 when there are no tickets", async () => {
    const res = await request(app).get(route("/tickets"));

    assert.equal(res.status, StatusCodes.NOT_FOUND);
    assert.equal(res.body.message, "Tickets not found");
  });

  it("GET /tickets/:id returns a ticket when found", async () => {
    const ticket = await Ticket.create({
      title: "My ticket",
      description: "Details",
      status: TicketStatus.OPEN,
    });

    const res = await request(app).get(route(`/tickets/${ticket.id}`));

    assert.equal(res.status, StatusCodes.OK);
    assert.equal(res.body.ticket.id ?? res.body.ticket._id, ticket.id);
    assert.equal(res.body.ticket.title, "My ticket");
    assert.equal(res.body.ticket.description, "Details");
    assert.equal(res.body.ticket.status, TicketStatus.OPEN);
  });

  it("GET /tickets/:id returns 404 when ticket not found", async () => {
    const missingId = uuidv4();

    const res = await request(app).get(route(`/tickets/${missingId}`));

    assert.equal(res.status, StatusCodes.NOT_FOUND);
    assert.equal(res.body.message, "Ticket not found");
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
    assert.equal(res.body.message, "Ticket created");

    const created = res.body.ticket;
    assert.equal(created.title, payload.title);
    assert.equal(created.description, payload.description);
    assert.equal(created.status, TicketStatus.OPEN);

    const ticket = await Ticket.findOne({ id: created.id });
    assert.ok(ticket);
    assert.equal(ticket!.title, payload.title);

    assert.equal(publishToRabbitMock.mock.callCount(), 1);
    const call = publishToRabbitMock.mock.calls[0];

    assert.equal(call.arguments[0], TicketRoutingKeys.CREATED);
    const eventPayload = call.arguments[1];

    assert.equal(eventPayload.id, created.id);
    assert.equal(eventPayload.title, payload.title);
    assert.equal(eventPayload.description, payload.description);
    assert.equal(eventPayload.status, TicketStatus.OPEN);
    assert.equal(typeof eventPayload.created_at, "string");
  });

  it("PUT /tickets/:id updates a ticket and publishes UPDATED event", async () => {
    const ticket = await Ticket.create({
      title: "Old title",
      description: "Old desc",
      status: TicketStatus.OPEN,
    });

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
    assert.equal(res.body.message, "Ticket updated");
    assert.equal(res.body.ticket.title, updatePayload.title);
    assert.equal(res.body.ticket.description, updatePayload.description);
    assert.equal(res.body.ticket.status, updatePayload.status);

    const updatedTicket = await Ticket.findOne({ id: ticket.id });
    assert.ok(updatedTicket);
    assert.equal(updatedTicket!.title, updatePayload.title);
    assert.equal(updatedTicket!.status, updatePayload.status);

    assert.equal(publishToRabbitMock.mock.callCount(), 1);
    const call = publishToRabbitMock.mock.calls[0];

    assert.equal(call.arguments[0], TicketRoutingKeys.UPDATED);
    const eventPayload = call.arguments[1];

    assert.equal(eventPayload.id, ticket.id);
    assert.equal(eventPayload.title, updatePayload.title);
    assert.equal(eventPayload.description, updatePayload.description);
    assert.equal(eventPayload.status, updatePayload.status);
    assert.equal(typeof eventPayload.created_at, "string");
  });

  it("PUT /tickets/:id returns 404 when ticket not found", async () => {
    const missingId = uuidv4();

    const res = await request(app)
      .put(route(`/tickets/${missingId}`))
      .send({ title: "x", description: "y", status: TicketStatus.OPEN })
      .set("Content-Type", "application/json");

    assert.equal(res.status, StatusCodes.NOT_FOUND);
    assert.equal(res.body.message, "Ticket not found");
    assert.equal(publishToRabbitMock.mock.callCount(), 0);
  });

  it("DELETE /tickets/:id deletes ticket and publishes DELETED event", async () => {
    const ticket = await Ticket.create({
      title: "To delete",
      description: "doesnt matter",
      status: TicketStatus.OPEN,
    });

    const res = await request(app).delete(route(`/tickets/${ticket.id}`));

    assert.equal(res.status, StatusCodes.OK);
    assert.equal(res.body.message, "Ticket deleted");

    const deletedTicket = await Ticket.findOne({ id: ticket.id });
    assert.equal(deletedTicket, null);

    assert.equal(publishToRabbitMock.mock.callCount(), 1);
    const call = publishToRabbitMock.mock.calls[0];

    assert.equal(call.arguments[0], TicketRoutingKeys.DELETED);
    const eventPayload = call.arguments[1];

    assert.equal(eventPayload.id, ticket.id);
    assert.equal(eventPayload.title, "To delete");
    assert.equal(typeof eventPayload.created_at, "string");
  });

  it("DELETE /tickets/:id returns 404 when ticket not found", async () => {
    const missingId = uuidv4();

    const res = await request(app).delete(route(`/tickets/${missingId}`));

    assert.equal(res.status, StatusCodes.NOT_FOUND);
    assert.equal(res.body.message, "Ticket not found");
    assert.equal(publishToRabbitMock.mock.callCount(), 0);
  });
});
