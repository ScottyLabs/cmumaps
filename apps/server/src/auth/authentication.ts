// https://tsoa-community.github.io/docs/authentication.html#authentication
// https://medium.com/@alexandre.penombre/tsoa-the-library-that-will-supercharge-your-apis-c551c8989081
import type * as express from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { env } from "../env.ts";
import type { HttpError } from "../middleware/errorHandler.ts";
import {
  AuthenticationError,
  AuthorizationError,
  InternalServerError,
} from "../middleware/errorHandler.ts";
import { AUTH_ISSUER, AUTH_JWKS_URI } from "./authSetup.ts";

export const OIDC_AUTH = "oidc";
export const BEARER_AUTH = "bearerAuth";
export const ADMIN_SCOPE = "cmumaps-admins";
export const MEMBER_SCOPE = "cmumaps-members";

declare module "express" {
  interface Request {
    authErrors?: HttpError[];
  }
}

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[],
) {
  // Store all authentication errors in the request object
  // so we can return the most relevant error to the client in errorHandler
  request.authErrors = request.authErrors ?? [];

  return new Promise((resolve, reject) => {
    if (securityName === OIDC_AUTH) {
      return validateOidc(request, reject, resolve, scopes);
    }

    if (securityName === BEARER_AUTH) {
      return verifyBearerAuth(request, reject, resolve, scopes);
    }

    const err = new InternalServerError("Invalid security name");
    request.authErrors?.push(err);
    return reject(err);
  });
}

// Verify OpenID Connect Authentication by checking the user object and scopes
const validateOidc = (
  request: express.Request,
  reject: (value: unknown) => void,
  resolve: (value: unknown) => void,
  scopes?: string[],
) => {
  // Check if the user is authenticated
  // (user object is set by the passport.js middleware)
  if (!request.user) {
    const err = new AuthenticationError();
    request.authErrors?.push(err);
    return reject(err);
  }

  // Check if the user has any of the required scopes
  if (!hasAnyScope(request.user.groups, scopes)) {
    return scopeValidationError(request, reject);
  }

  return resolve({ ...request.user });
};

// Verify Bearer Authentication by verifying the token and checking the scopes
const client = jwksClient({ jwksUri: AUTH_JWKS_URI });
const verifyBearerAuth = (
  request: express.Request,
  reject: (value: unknown) => void,
  resolve: (value: unknown) => void,
  scopes?: string[],
) => {
  const token = request.headers.authorization?.split(" ")[1];
  if (!token) {
    const err = new AuthenticationError();
    request.authErrors?.push(err);
    return reject(err);
  }

  jwt.verify(
    token,
    (header, callback) => {
      client.getSigningKey(header.kid, (_error, key) => {
        const signingKey = key?.getPublicKey();
        callback(null, signingKey);
      });
    },
    { issuer: AUTH_ISSUER, audience: env.AUTH_CLIENT_ID },
    (error, decoded) => {
      // Check if the token is valid
      if (error) {
        console.error("Authentication error:", error.message);
        const err = new AuthenticationError();
        request.authErrors?.push(err);
        return reject(err);
      }

      // Check if the token format is valid
      if (!decoded || typeof decoded !== "object") {
        const err = new AuthenticationError();
        request.authErrors?.push(err);
        return reject(err);
      }

      // Check if the token contains any of the required scopes
      if (!hasAnyScope(decoded["groups"], scopes)) {
        return scopeValidationError(request, reject);
      }

      return resolve({ ...decoded });
    },
  );
};

// Verify if the groups contain ANY of the required scopes
const hasAnyScope = (groups?: string[], scopes?: string[]) => {
  // If no scopes are required, return true
  if (scopes?.length === 0) {
    return true;
  }

  // If no groups are present, return false
  if (groups?.length === 0) {
    return false;
  }

  // Check if any of the groups contain any of the required scopes
  return groups?.some((group) => scopes?.includes(group));
};

const scopeValidationError = (
  request: express.Request,
  reject: (value: unknown) => void,
) => {
  const err = new AuthorizationError(
    "Insufficient permissions to access this resource.",
  );
  request.authErrors?.push(err);
  return reject(err);
};
