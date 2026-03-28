import mongoose from "mongoose";
import { outboxSchema } from "../schemas/outbox.schema.ts";

export const Outbox = mongoose.model("Outbox", outboxSchema);
