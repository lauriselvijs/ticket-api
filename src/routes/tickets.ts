import { Router } from "express";
import {
  createTicket,
  deleteTicket,
  getTicketById,
  getTickets,
  updateTicket,
} from "../controllers/ticket.ts";
import { ticketSchema } from "../schemas/tickets.ts";
import { validate } from "../middleware/validate.ts";

export const router = Router();

router.get("/", getTickets);
router.get("/:id", getTicketById);
router.post("/", validate(ticketSchema), createTicket);
router.put("/:id", validate(ticketSchema), updateTicket);
router.delete("/:id", deleteTicket);

export default router;
