import Ticket from "../../domain/ticket/entities/Ticket.ts";
import type { TicketRepository } from "../../domain/ticket/repositories/TicketRepository.ts";
import NotFoundError from "../errors/NotFoundError.ts";

export class GetTicketUseCase {
  constructor(private readonly ticketRepository: TicketRepository) {}

  async execute(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findById(id);

    if (!ticket) {
      throw new NotFoundError(`Ticket with id ${id} not found`);
    }

    return ticket;
  }
}
