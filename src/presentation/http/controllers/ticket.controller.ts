import type { NextFunction, Request, Response } from "express";
import type CreateTicketUseCase from "../../../application/use-cases/CreateTicketUseCase.ts";
import CreateTicketDto from "../../../application/dtos/CreateTicketDto.ts";
import { StatusCodes } from "http-status-codes";
import GetTicketsUseCase from "../../../application/use-cases/GetTicketsUseCase.ts";
import { GetTicketUseCase } from "../../../application/use-cases/GetTicketUseCase.ts";
import UpdateTicketDto from "../../../application/dtos/UpdateTicketDto.ts";
import { UpdateTicketUseCase } from "../../../application/use-cases/UpdateTicketUseCase.ts";
import { TicketResponseDto } from "../../../application/dtos/TicketResponseDto.ts";
import { DeleteTicketUseCase } from "../../../application/use-cases/DeleteTicketUseCase.ts";

export class TicketController {
  constructor(
    private readonly createTicketUseCase: CreateTicketUseCase,
    private readonly getTicketsUseCase: GetTicketsUseCase,
    private readonly getTicketUseCase: GetTicketUseCase,
    private readonly updateTicketUseCase: UpdateTicketUseCase,
    private readonly deleteTicketUseCase: DeleteTicketUseCase,
  ) {}
  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const tickets = await this.getTicketsUseCase.execute();

      const response = tickets.map((ticket) => TicketResponseDto.from(ticket));

      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      return next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const ticket = await this.getTicketUseCase.execute(id);

      const response = TicketResponseDto.from(ticket);

      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      return next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = CreateTicketDto.from(req.body);

      const ticket = await this.createTicketUseCase.execute(dto);

      const response = TicketResponseDto.from(ticket);

      res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
      return next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const dto = UpdateTicketDto.from(req.body);

      const ticket = await this.updateTicketUseCase.execute(id, dto);

      const response = TicketResponseDto.from(ticket);

      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      return next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.deleteTicketUseCase.execute(id);

      console.log("Ticket deleted successfully");
      res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (error) {
      return next(error);
    }
  };
}
