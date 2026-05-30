import type { DbSession } from "../../../../application/ports/DbSession.ts";
import Ticket from "../../../../domain/ticket/entities/Ticket.ts";
import type { TicketRepository } from "../../../../domain/ticket/repositories/TicketRepository.ts";
import type { TicketStatus } from "../../../../domain/ticket/enums/TicketStatus.ts";
import prisma from "../prisma.client.ts";
import { PrismaDbSession } from "../PrismaDbSession.ts";

type PrismaClientLike = typeof prisma | PrismaDbSession["client"];

const getClient = (session?: DbSession): PrismaClientLike => {
  if (!session) return prisma;

  if (!(session instanceof PrismaDbSession)) {
    throw new Error("Prisma adapter requires PrismaDbSession");
  }

  return session.client;
};

const toTicket = (ticket: {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  deletedAt: Date | null;
}): Ticket =>
  Ticket.rehydrate(
    ticket.id,
    ticket.title,
    ticket.description,
    ticket.status as TicketStatus,
    ticket.createdAt,
    ticket.deletedAt,
  );

export class PrismaTicketRepository implements TicketRepository {
  async findAll(): Promise<Ticket[]> {
    const tickets = await prisma.ticket.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
    return tickets.map(toTicket);
  }

  async findById(id: string): Promise<Ticket | null> {
    const ticket = await prisma.ticket.findFirst({
      where: { id, deletedAt: null },
    });
    if (!ticket) return null;
    return toTicket(ticket);
  }

  async create(ticket: Ticket, session?: DbSession): Promise<Ticket> {
    const client = getClient(session);
    const created = await client.ticket.create({
      data: {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
      },
    });
    return toTicket(created);
  }

  async update(ticket: Ticket, session?: DbSession): Promise<Ticket | null> {
    const client = getClient(session);
    const updated = await client.ticket.update({
      where: { id: ticket.id },
      data: {
        ...(ticket.title && { title: ticket.title }),
        ...(ticket.description && { description: ticket.description }),
        ...(ticket.status && { status: ticket.status }),
      },
    });
    return toTicket(updated);
  }

  async save(ticket: Ticket, session?: DbSession): Promise<void> {
    const client = getClient(session);
    await client.ticket.update({
      where: { id: ticket.id },
      data: {
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        deletedAt: ticket.deletedAt,
      },
    });
  }
}
