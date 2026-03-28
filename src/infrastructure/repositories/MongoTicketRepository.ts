import { Ticket as TicketModel } from "../persistence/mongo/models/ticket.ts";
import Ticket from "../../domain/ticket/entities/Ticket.ts";
import type { TicketRepository } from "../../domain/ticket/repositories/TicketRepository.ts";
import type { DbSession } from "../../application/ports/DbSession.ts";
import { MongoDbSession } from "../persistence/mongo/MongoDbSession.ts";

export class MongoTicketRepository implements TicketRepository {
  async findById(id: string): Promise<Ticket | null> {
    const ticket = await TicketModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!ticket) return null;

    return Ticket.rehydrate(
      ticket.id,
      ticket.title,
      ticket.description,
      ticket.status,
      ticket.createdAt,
      ticket.deletedAt,
    );
  }

  async findAll(): Promise<Ticket[]> {
    const tickets = await TicketModel.find({ deletedAt: null });

    return tickets.map((ticket) =>
      Ticket.rehydrate(
        ticket.id,
        ticket.title,
        ticket.description,
        ticket.status,
        ticket.createdAt,
        ticket.deletedAt,
      ),
    );
  }

  async create(ticket: Ticket, session?: DbSession): Promise<Ticket> {
    if (!(session instanceof MongoDbSession)) {
      throw new Error("Mongo adapter requires MongoDbSession");
    }

    const newTicket = await TicketModel.create(
      [
        {
          id: ticket.id,
          title: ticket.title,
          description: ticket.description,
          status: ticket.status,
          createdAt: ticket.createdAt,
        },
      ],
      { session: session.raw },
    );

    const created = newTicket[0];

    return Ticket.rehydrate(
      created.id,
      created.title,
      created.description,
      created.status,
      created.createdAt,
      ticket.deletedAt,
    );
  }

  async update(ticket: Ticket, session?: DbSession): Promise<Ticket | null> {
    if (!(session instanceof MongoDbSession)) {
      throw new Error("Mongo adapter requires MongoDbSession");
    }

    const updated = await TicketModel.findOneAndUpdate(
      {
        _id: ticket.id,
        deletedAt: null,
      },
      {
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
      },
      {
        new: true,
        session: session.raw,
      },
    );

    if (!updated) {
      return null;
    }

    return Ticket.rehydrate(
      updated._id.toString(),
      updated.title,
      updated.description,
      updated.status,
      updated.createdAt,
      updated.deletedAt,
    );
  }

  async save(ticket: Ticket, session?: DbSession): Promise<void> {
    if (!(session instanceof MongoDbSession)) {
      throw new Error("Mongo adapter requires MongoDbSession");
    }

    await TicketModel.updateOne(
      { _id: ticket.id },
      {
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        deletedAt: ticket.deletedAt,
      },
      { session: session.raw },
    );
  }
}
