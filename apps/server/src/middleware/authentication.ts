// https://tsoa-community.github.io/docs/authentication.html#authentication
// https://medium.com/@alexandre.penombre/tsoa-the-library-that-will-supercharge-your-apis-c551c8989081
import type * as express from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import env from "../env";

declare global {
  namespace Express {
    interface Request {
      user: { token: string } | null;
    }
  }
}

const client = jwksClient({
  jwksUri: env.AUTH_JWKS_URI,
});

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  _scopes?: string[],
) {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === "development") {
      return resolve({});
    }

    const response = request.res;
    if (securityName !== "oauth2") {
      response?.status(401).json({ message: "Invalid security name" });
      return reject({});
    }

    const token = request.headers.authorization?.split(" ")[1];
    if (!token) {
      if (request.path === "/auth/userInfo") {
        return resolve(null);
      }
      response?.status(401).json({ message: "No token provided" });
      return reject({});
    }

    jwt.verify(
      token,
      (header, callback) => {
        client.getSigningKey(header.kid, (_error, key) => {
          const signingKey = key?.getPublicKey();
          callback(null, signingKey);
        });
      },
      { issuer: env.AUTH_ISSUER },
      (error, _decoded) => {
        if (error) {
          console.error("Authentication error:", error.message);
          response?.status(401).json({ message: "Invalid token" });
          return reject({});
        }
        return resolve({ token });
      },
    );
  });
}
