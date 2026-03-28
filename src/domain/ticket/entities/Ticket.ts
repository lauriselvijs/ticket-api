import { TicketStatus } from "../enums/TicketStatus.ts";
import type { NewTicket } from "../types/Ticket.ts";
import type { UpdateTicket } from "../types/UpdateTicket.ts";

export default class Ticket {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string,
    public status: TicketStatus,
    public readonly createdAt: Date,
    public deletedAt: Date | null = null,
  ) {}

  static create(ticket: NewTicket): Ticket {
    return new Ticket(
      crypto.randomUUID(),
      ticket.title,
      ticket.description,
      ticket.status,
      new Date(),
    );
  }

  static rehydrate(
    id: string,
    title: string,
    description: string,
    status: TicketStatus,
    createdAt: Date,
    deletedAt: Date | null,
  ): Ticket {
    return new Ticket(id, title, description, status, createdAt, deletedAt);
  }

  update(data: UpdateTicket): Ticket {
    if (data.title !== undefined) this.title = data.title;
    if (data.description !== undefined) this.description = data.description;
    if (data.status !== undefined) this.status = data.status;

    return this;
  }

  delete(): void {
    if (this.deletedAt) {
      throw new Error("Ticket already deleted");
    }

    this.deletedAt = new Date();
  }

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  restore(): void {
    if (!this.deletedAt) {
      throw new Error("Not deleted");
    }

    this.deletedAt = null;
  }
}
