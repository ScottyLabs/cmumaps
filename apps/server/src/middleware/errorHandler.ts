import type { NextFunction, Request, Response } from "express";
import { ValidateError } from "tsoa";
import { BuildingError } from "../errors/error.ts";

export class HttpError extends Error {
  public status: number;
  public constructor(status: number, message?: string) {
    super(message);
    this.status = status;
  }
}

export class AuthenticationError extends HttpError {
  public constructor() {
    super(401, "Unauthenticated");
  }
}

export class AuthorizationError extends HttpError {
  public constructor(message: string) {
    super(403, message);
    this.name = "Forbidden";
  }
}

export class InternalServerError extends HttpError {
  public constructor(message: string) {
    super(500, message);
  }
}

// From https://tsoa-community.github.io/docs/error-handling.html
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // The authentication errors takes the highest priority
  const firstAuthError = req.authErrors?.[0];
  if (req.authErrors && firstAuthError) {
    // the most relevant error is the one with the highest status code
    // 500 (invalid security name here) > 403 Forbidden > 401 Unauthorized
    const errorToReturn = req.authErrors.reduce(
      (max, error) => (error.status > max.status ? error : max),
      firstAuthError,
    );

    return res.status(errorToReturn.status).json({
      status: errorToReturn.status,
      error: errorToReturn.name,
      message: errorToReturn.message,
    });
  }

  // Then the validation errors
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }

  // Then the other errors
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      status: err.status,
      error: err.name,
      message: err.message,
    });
  }

  // Then the custom building errors
  if (err instanceof BuildingError) {
    res.status(404).json({ code: err.code });
    return;
  }

  // Then the unknown errors
  if (err instanceof Error) {
    console.error(`Error ${req.path}`, err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", details: err.message });
  }

  next();
};
