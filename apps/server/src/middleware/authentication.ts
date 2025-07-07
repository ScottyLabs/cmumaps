// https://tsoa-community.github.io/docs/authentication.html#authentication
import { getAuth } from "@clerk/express";
import type * as express from "express";

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  _scopes?: string[],
) {
  if (securityName !== "bearerAuth") {
    return Promise.reject({ error: "Unauthorized" });
  }

  const auth = getAuth(request);
  if (!auth.userId) {
    return Promise.reject({ error: "Unauthorized" });
  }
  return Promise.resolve({ id: auth.userId });
}
