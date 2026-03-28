import { TicketStatus } from "../../domain/ticket/enums/TicketStatus.ts";

type UpdateTicket = {
  title: string;
  description: string;
  status: TicketStatus;
};

export default class UpdateTicketDto {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly status: TicketStatus,
  ) {}

  static from(data: UpdateTicket): UpdateTicketDto {
    return new UpdateTicketDto(data.title, data.description, data.status);
  }
}
