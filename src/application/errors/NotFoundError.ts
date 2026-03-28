import { StatusCodes } from "http-status-codes";

class NotFoundError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.status = StatusCodes.NOT_FOUND;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export default NotFoundError;
