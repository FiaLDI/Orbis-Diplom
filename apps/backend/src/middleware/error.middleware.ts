import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { DomainError, ValidationError } from "@/common/errors";

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
    console.error("❌ Global error:", err);

    if (err instanceof ZodError) {
        return res.status(400).json({
            error: "Validation error",
            details: err.issues.map((i) => ({
                path: i.path.join("."),
                message: i.message,
            })),
        });
    }

    if (err instanceof ValidationError) {
        return res.status(err.status).json({
            error: err.message,
            details: err.details ?? null,
        });
    }

    if (err instanceof DomainError) {
        return res.status(err.status).json({
            error: err.message,
        });
    }

    return res.status(500).json({
        error: "Internal server error",
    });
}
