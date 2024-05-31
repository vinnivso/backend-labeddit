import { BaseError } from "./BaseError";

export class BadRequestError extends BaseError {
  constructor(message = "Invalid Request.") {
    super(400, message);
  }
}