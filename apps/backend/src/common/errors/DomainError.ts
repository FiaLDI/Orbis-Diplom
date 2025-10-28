import { HttpError } from "./HttpError";

export class DomainError extends HttpError {
  constructor(message: string, details?: any) {
    super(message, 400, details);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
