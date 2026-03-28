import { TicketStatus } from "../../domain/ticket/enums/TicketStatus.ts";

type CreateTicket = {
  title: string;
  description: string;
  status: TicketStatus;
};

export default class CreateTicketDto {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly status: TicketStatus,
  ) {}

  static from(data: CreateTicket): CreateTicketDto {
    return new CreateTicketDto(data.title, data.description, data.status);
  }
}
