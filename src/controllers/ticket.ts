import { publishToRabbit } from "../config/rabbit.ts";
import { type NextFunction, type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";
import { TicketRoutingKeys, TicketStatus } from "../enums/tickets.ts";
import type { Ticket as TicketType } from "../schemas/tickets.ts";
import { Ticket } from "../models/ticket.ts";

export const getTickets = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tickets = await Ticket.find();
    if (tickets.length > 0) {
      return res.json({ tickets });
    }
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Tickets not found" });
  } catch (err) {
    return next(err);
  }
};

export const getTicketById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findOne({ id });
    if (ticket) {
      return res.json({ ticket });
    }
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Ticket not found" });
  } catch (err) {
    return next(err);
  }
};

export const createTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description } = req.body as TicketType;

    const ticket = new Ticket({
      title,
      description,
      status: TicketStatus.OPEN,
    });

    await ticket.save();

    publishToRabbit(TicketRoutingKeys.CREATED, {
      id: ticket.id,
      title: ticket.title,
      status: ticket.status,
      description: ticket.description,
      created_at: new Date().toISOString(),
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Ticket created", ticket });
  } catch (err) {
    return next(err);
  }
};

export const updateTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body as TicketType;

    const ticket = await Ticket.findOne({ id });
    if (!ticket) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Ticket not found" });
    }

    Object.assign(ticket, { title, description, status });
    const newTicket = await ticket.save();

    publishToRabbit(TicketRoutingKeys.UPDATED, {
      id: newTicket.id,
      title: newTicket.title,
      status: newTicket.status,
      description: newTicket.description,
      created_at: new Date().toISOString(),
    });

    return res.json({ message: "Ticket updated", ticket: newTicket });
  } catch (err) {
    return next(err);
  }
};

export const deleteTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findOneAndDelete({ id });
    if (ticket) {
      publishToRabbit(TicketRoutingKeys.DELETED, {
        id: ticket.id,
        title: ticket.title,
        created_at: new Date().toISOString(),
      });

      return res.json({ message: "Ticket deleted" });
    }

    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Ticket not found" });
  } catch (err) {
    return next(err);
  }
};
