import type { TicketRepository } from "../../domain/ticket/repositories/TicketRepository.ts";
import Ticket from "../../domain/ticket/entities/Ticket.ts";

export default class GetTicketsUseCase {
  constructor(private readonly ticketRepository: TicketRepository) {}

  async execute(): Promise<Ticket[]> {
    const tickets = await this.ticketRepository.findAll();

    return tickets;
  }
}
