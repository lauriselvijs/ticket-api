import type { Express } from "express";
import { globalErrorHandler } from "./errors.ts";
import { logger } from "./logging.ts";

export const middleware = (app: Express) => {
  app.use(logger);
};
