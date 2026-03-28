import type { Express } from "express";
import { route } from "./util/routes.ts";
import health from "./health.ts";
import tickets from "./tickets.ts";

export const routes = (app: Express) => {
  app.use(route("/health"), health);
  app.use(route("/tickets"), tickets);
};
