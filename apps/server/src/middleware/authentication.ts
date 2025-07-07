// https://tsoa-community.github.io/docs/authentication.html#authentication
// https://medium.com/@alexandre.penombre/tsoa-the-library-that-will-supercharge-your-apis-c551c8989081
import { getAuth } from "@clerk/express";
import type * as express from "express";

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  _scopes?: string[],
) {
  const response = request.res;
  if (securityName !== "bearerAuth") {
    response?.status(401).json({ message: "No token provided" });
  }

  const auth = getAuth(request);
  if (!auth.userId) {
    response?.status(401).json({ message: "Invalid token" });
  }

  return Promise.resolve({ id: auth.userId });
}
