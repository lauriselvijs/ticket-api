import { Router } from "express";

import {
  createTicketSchema,
  updateTicketSchema,
} from "../validation/ticket.validation.ts";
import { validate } from "../middleware/validate.ts";
import { ticketController } from "../../../container.ts";

export const router = Router();

router.get("/", ticketController.getAll);
router.get("/:id", ticketController.findById);
router.post("/", validate(createTicketSchema), ticketController.create);
router.put("/:id", validate(updateTicketSchema), ticketController.update);
router.delete("/:id", ticketController.delete);

export default router;
