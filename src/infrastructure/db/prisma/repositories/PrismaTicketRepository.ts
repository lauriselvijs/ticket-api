import { TicketRepository } from "../../../domain/ticket/repositories/TicketRepository.ts";
import { Ticket as TicketEntity } from "../../../domain/ticket/types/Ticket.ts";
import { NewTicket } from "../../../domain/ticket/types/NewTicket.ts";
import { UpdateTicket } from "../../../domain/ticket/types/UpdateTicket.ts";
import prisma from "./prisma.client.ts";

export class PrismaTicketRepository implements TicketRepository {
  async findAll(): Promise<TicketEntity[]> {
    const tickets = await prisma.ticket.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
    return tickets.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      deletedAt: t.deletedAt,
    }));
  }

  async findById(id: string): Promise<TicketEntity | null> {
    const ticket = await prisma.ticket.findFirst({
      where: { id, deletedAt: null },
    });
    if (!ticket) return null;
    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      deletedAt: ticket.deletedAt,
    };
  }

  async create(ticket: NewTicket): Promise<TicketEntity> {
    const created = await prisma.ticket.create({
      data: {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
      },
    });
    return {
      id: created.id,
      title: created.title,
      description: created.description,
      status: created.status,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
      deletedAt: created.deletedAt,
    };
  }

  async update(id: string, ticket: UpdateTicket): Promise<TicketEntity | null> {
    const updated = await prisma.ticket.update({
      where: { id },
      data: {
        ...(ticket.title && { title: ticket.title }),
        ...(ticket.description && { description: ticket.description }),
        ...(ticket.status && { status: ticket.status }),
      },
    });
    return {
      id: updated.id,
      title: updated.title,
      description: updated.description,
      status: updated.status,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      deletedAt: updated.deletedAt,
    };
  }

  async softDelete(id: string): Promise<void> {
    await prisma.ticket.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
