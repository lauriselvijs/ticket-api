import CreateTicketUseCase from "./application/use-cases/CreateTicketUseCase.ts";
import { DeleteTicketUseCase } from "./application/use-cases/DeleteTicketUseCase.ts";
import GetTicketsUseCase from "./application/use-cases/GetTicketsUseCase.ts";
import { GetTicketUseCase } from "./application/use-cases/GetTicketUseCase.ts";
import { TicketLifecycleChoreographySaga } from "./application/sagas/TicketLifecycleChoreographySaga.ts";
import { UpdateTicketUseCase } from "./application/use-cases/UpdateTicketUseCase.ts";
import { PrismaDbConnection } from "./infrastructure/db/prisma/PrismaDbConnection.ts";
import { PrismaOutboxRepository } from "./infrastructure/db/prisma/repositories/PrismaOutboxRepository.ts";
import { PrismaTicketRepository } from "./infrastructure/db/prisma/repositories/PrismaTicketRepository.ts";
import { TicketController } from "./presentation/http/controllers/ticket.controller.ts";

const ticketRepository = new PrismaTicketRepository();
const outboxRepository = new PrismaOutboxRepository();
const dbConnection = new PrismaDbConnection();
const ticketLifecycleSaga = new TicketLifecycleChoreographySaga(
  outboxRepository,
);

export const createTicketUseCase = new CreateTicketUseCase(
  ticketRepository,
  ticketLifecycleSaga,
  dbConnection,
);

export const getTicketsUseCase = new GetTicketsUseCase(ticketRepository);

export const getTicketUseCase = new GetTicketUseCase(ticketRepository);

export const updateTicketUseCase = new UpdateTicketUseCase(
  ticketRepository,
  ticketLifecycleSaga,
  dbConnection,
);

export const deleteTicketUseCase = new DeleteTicketUseCase(
  ticketRepository,
  ticketLifecycleSaga,
  dbConnection,
);

export const ticketController = new TicketController(
  createTicketUseCase,
  getTicketsUseCase,
  getTicketUseCase,
  updateTicketUseCase,
  deleteTicketUseCase,
);
