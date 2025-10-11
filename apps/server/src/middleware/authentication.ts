// https://tsoa-community.github.io/docs/authentication.html#authentication
// https://medium.com/@alexandre.penombre/tsoa-the-library-that-will-supercharge-your-apis-c551c8989081

import { clerkClient, getAuth } from "@clerk/express";
import type * as express from "express";

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[],
) {
  return new Promise((resolve, reject) => {
    const response = request.res;
    if (securityName !== "oauth2") {
      response?.status(401).json({ message: "Invalid security name" });
      return reject({});
    }

    // https://clerk.com/docs/references/express/overview#get-auth
    // Use Clerk user id to check if user is authenticated
    const auth = getAuth(request);
    if (!auth.userId) {
      response?.status(401).json({ message: "User is not authenticated" });
      return reject({});
    }

    // Use Clerk organization membership to check if user has required scopes
    clerkClient.users
      .getOrganizationMembershipList({
        userId: auth.userId,
      })
      .then(({ data }) => {
        const roles = new Set<string>();
        data.forEach((membership) => {
          if (membership.organization.slug === "cmumaps") {
            roles.add(membership.role);
          }
        });

        for (const scope of scopes ?? []) {
          if (!roles.has(scope)) {
            response
              ?.status(401)
              .json({ message: "User does not have required scope." });
            return reject({});
          }
        }

        return resolve({});
      });
  });
}
