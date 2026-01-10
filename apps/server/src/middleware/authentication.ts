// https://tsoa-community.github.io/docs/authentication.html#authentication
// https://medium.com/@alexandre.penombre/tsoa-the-library-that-will-supercharge-your-apis-c551c8989081
import { clerkClient, getAuth } from "@clerk/express";
import type * as express from "express";
import { env } from "../env.ts";

export const BEARER_AUTH = "bearerAuth";
export const MEMBER_SCOPE = "org:member";
export const ADMIN_SCOPE = "org:admin";

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[],
) {
  // biome-ignore lint/nursery/noMisusedPromises: not sure how TSOA works here but will be refactored later anyways
  return new Promise((resolve, reject) => {
    const response = request.res;
    if (securityName !== BEARER_AUTH) {
      response?.status(401).json({ message: "Invalid security name" });
      return reject({});
    }

    return verifyToken(request, response, reject, resolve, scopes);
  });
}

const verifyToken = async (
  request: express.Request,
  response: express.Response | undefined,
  reject: (value: unknown) => void,
  resolve: (value: unknown) => void,
  scopes?: string[],
) => {
  const token = request.headers.authorization;
  if (!token) {
    response?.status(401).json({ message: "No token provided" });
    return reject({});
  }

  // Check if the request is authenticated using the M2M token first
  try {
    const m2mTokenVerified = await clerkClient.m2m.verifyToken({
      token: token.replace("Bearer ", ""),
      machineSecretKey: env.CLERK_MACHINE_SECRET,
    });

    if (m2mTokenVerified) {
      return resolve({});
    }
  } catch {
    // If the token is invalid, expired, or unrecognized,
    // the verifyToken function throws a ClerkAPIResponseError
    // so we can just catch the error and continue to the next step
  }

  // https://clerk.com/docs/references/express/overview#get-auth
  // Use Clerk user id to check if user is authenticated
  const auth = getAuth(request);
  if (!auth.userId) {
    response?.status(401).json({ message: "User is not authenticated" });
    return reject({});
  }

  // Use Clerk organization membership to check if user has required scopes
  // Note that there are only two scopes: admin and member and an admin can access member scope
  const { data } = await clerkClient.users.getOrganizationMembershipList({
    userId: auth.userId,
  });

  if (scopes?.length === 0) {
    return resolve({});
  }

  let isAdmin = false;
  let isMember = false;
  for (const membership of data) {
    if (membership.organization.slug === "cmumaps") {
      if (membership.role === ADMIN_SCOPE) {
        isAdmin = true;
        isMember = true;
      }

      if (membership.role === MEMBER_SCOPE) {
        isMember = true;
      }
    }
  }

  if (scopes?.includes(ADMIN_SCOPE) && !isAdmin) {
    response
      ?.status(401)
      .json({ message: "User does not have required scope.s" });
    return reject({});
  }

  if (scopes?.includes(MEMBER_SCOPE) && !isMember) {
    response
      ?.status(401)
      .json({ message: "User does not have required scope." });
    return reject({});
  }

  // Should never reach here because the check on scopes should be exhaustive
  return resolve({});
};
