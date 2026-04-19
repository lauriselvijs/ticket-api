import type { NextFunction, Request, Response } from "express";
import HttpError from "../errors/HttpError.ts";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "../../../application/errors/NotFoundError.ts";

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof NotFoundError) {
    return res.status(err.status).json({ message: err.message });
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: err.message || "Internal Server Error" });
};
