import { ClientSession } from "mongoose";
import { Ticket as TicketModel } from "../persistence/mongo/models/ticket.ts";
import Ticket from "../../domain/ticket/entities/Ticket.ts";
import { TicketRepository } from "../../domain/ticket/repositories/TicketRepository.ts";

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

  async create(ticket: Ticket, session?: ClientSession): Promise<Ticket> {
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
      { session },
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

  async update(
    ticket: Ticket,
    session?: ClientSession,
  ): Promise<Ticket | null> {
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
        session,
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

  async save(ticket: Ticket, session?: ClientSession): Promise<void> {
    await TicketModel.updateOne(
      { _id: ticket.id },
      {
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        deletedAt: ticket.deletedAt,
      },
      { session },
    );
  }
}
