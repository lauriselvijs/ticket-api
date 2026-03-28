import express from "express";
import { middleware } from "./presentation/http/middleware/index.ts";
import { routes } from "./presentation/http/routes/index.ts";
import { configureExpress } from "./presentation/http/config/express.ts";

const createApp = () => {
  const app = express();

  configureExpress(app);
  middleware(app);
  routes(app);

  return app;
};

export { createApp };
