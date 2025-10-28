import {
  DomainError,
  UnauthorizedError,
  ValidationError,
  NotFoundError,
  ConflictError,
} from "./index";

export const Errors = {
  domain: (msg: string) => new DomainError(msg),
  unauthorized: (msg = "Unauthorized") => new UnauthorizedError(msg),
  notFound: (msg = "Not Found") => new NotFoundError(msg),
  conflict: (msg = "Conflict") => new ConflictError(msg),
  validation: (msg = "Validation failed", details?: any) =>
    new ValidationError(msg, details),
};
