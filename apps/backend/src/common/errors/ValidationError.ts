import { HttpError } from "./HttpError";

export class ValidationError extends HttpError {
  constructor(message = "Validation failed", details?: any) {
    super(message, 400, details);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
