import type { Express } from "express";
import express from "express";

export const configureExpress = (app: Express) => {
  app.use(express.json());
};
