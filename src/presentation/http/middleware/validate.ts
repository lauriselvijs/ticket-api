import type { NextFunction, Response, Request } from "express";
import type { ZodObject, ZodRawShape } from "zod";
import { StatusCodes } from "http-status-codes";

export const validate =
  (schema: ZodObject<ZodRawShape>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (result.success) {
      req.body = result.data;

      return next();
    }

    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Invalid data",
      details: result.error.message,
    });
  };
