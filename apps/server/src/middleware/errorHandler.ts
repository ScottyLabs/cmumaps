import type { NextFunction, Request, Response } from "express";
import { ValidateError } from "tsoa";
import { BuildingError } from "../errors/error.ts";

// From https://tsoa-community.github.io/docs/error-handling.html
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }

  if (err instanceof BuildingError) {
    res.status(404).json({ code: err.code });
    return;
  }

  if (err instanceof Error) {
    console.error(`Error ${req.path}`, err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", details: err.message });
  }

  next();
};
