import { BaseError } from "./BaseError";

export class NotFoundError extends BaseError {
  constructor(message = "Item not found.") {
    super(404, message);
  }
}