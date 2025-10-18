// https://tsoa-community.github.io/docs/authentication.html#authentication
// https://medium.com/@alexandre.penombre/tsoa-the-library-that-will-supercharge-your-apis-c551c8989081

import { clerkClient, getAuth } from "@clerk/express";
import type * as express from "express";

export const BEARER_AUTH = "bearerAuth";
export const MEMBER_SCOPE = "org:member";
export const ADMIN_SCOPE = "org:admin";

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[],
) {
  return new Promise((resolve, reject) => {
    const response = request.res;
    if (securityName !== BEARER_AUTH) {
      response?.status(401).json({ message: "Invalid security name" });
      return reject({});
    }

    // https://clerk.com/docs/references/express/overview#get-auth
    // Use Clerk user id to check if user is authenticated
    try {
      const auth = getAuth(request);
      if (!("userId" in auth) || !auth.userId) {
        response?.status(401).json({ message: "User is not authenticated" });
        return reject({});
      }

      // Use Clerk organization membership to check if user has required scopes
      // Note that there are only two scopes: admin and member and an admin can access member scope
      clerkClient.users
        .getOrganizationMembershipList({
          userId: auth.userId,
        })
        .then(({ data }) => {
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

          // should never reach here because the check on scopes should be exhaustive
          return resolve({});
        });
    } catch (error) {
      console.error(error);
      response?.status(401).json({ message: "Error authorizing user." });
      return reject({});
    }
  });
}
