import Ticket from "../../domain/ticket/entities/Ticket.ts";

export class TicketResponseDto {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string,
    public status: string,
    public readonly createdAt: Date,
  ) {}

  static from(ticket: Ticket): TicketResponseDto {
    return new TicketResponseDto(
      ticket.id,
      ticket.title,
      ticket.description,
      ticket.status,
      ticket.createdAt,
    );
  }
}
