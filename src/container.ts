import CreateTicketUseCase from "./application/use-cases/CreateTicketUseCase.ts";
import { DeleteTicketUseCase } from "./application/use-cases/DeleteTicketUseCase.ts";
import GetTicketsUseCase from "./application/use-cases/GetTicketsUseCase.ts";
import { GetTicketUseCase } from "./application/use-cases/GetTicketUseCase.ts";
import { UpdateTicketUseCase } from "./application/use-cases/UpdateTicketUseCase.ts";
import { MongoDbConnection } from "./infrastructure/persistence/mongo/MongoDbConnection.ts";
import { MongoOutboxRepository } from "./infrastructure/repositories/MongoOutboxRepository.ts";
import { MongoTicketRepository } from "./infrastructure/repositories/MongoTicketRepository.ts";
import { TicketController } from "./presentation/http/controllers/ticket.controller.ts";

const ticketRepository = new MongoTicketRepository();
const outboxRepository = new MongoOutboxRepository();
const dbConnection = new MongoDbConnection();

export const createTicketUseCase = new CreateTicketUseCase(
  ticketRepository,
  outboxRepository,
  dbConnection,
);

export const getTicketsUseCase = new GetTicketsUseCase(ticketRepository);

export const getTicketUseCase = new GetTicketUseCase(ticketRepository);

export const updateTicketUseCase = new UpdateTicketUseCase(
  ticketRepository,
  outboxRepository,
  dbConnection,
);

export const deleteTicketUseCase = new DeleteTicketUseCase(
  ticketRepository,
  outboxRepository,
  dbConnection,
);

export const ticketController = new TicketController(
  createTicketUseCase,
  getTicketsUseCase,
  getTicketUseCase,
  updateTicketUseCase,
  deleteTicketUseCase,
);
