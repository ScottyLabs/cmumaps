import { Buffer } from "node:buffer";
import type { BetterAuthPlugin } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { z } from "zod";

const relayStateSchema = z.object({
  // Ricochet's wire protocol uses return_to for its allowlisted destination.
  // biome-ignore lint/style/useNamingConvention: Ricochet protocol field
  return_to: z.string(),
  state: z.string().min(1),
});

/** Adapt Ricochet's routing envelope while retaining BetterAuth's OAuth state. */
export const ricochetOAuth = ({
  callbackURL,
  relayURL,
}: {
  callbackURL: string;
  relayURL: string;
}): BetterAuthPlugin => ({
  id: "ricochet-oauth",
  hooks: {
    after: [
      {
        matcher: (ctx) =>
          (ctx.path === "/sign-in/social" &&
            ctx.body?.provider === "keycloak") ||
          (ctx.path === "/sign-in/oauth2" &&
            ctx.body?.providerId === "keycloak"),
        handler: createAuthMiddleware(async (ctx) => {
          const result = ctx.context.returned;
          if (
            !result ||
            typeof result !== "object" ||
            !("url" in result) ||
            typeof result.url !== "string"
          )
            return;
          const authorizationURL = new URL(result.url);
          const state = authorizationURL.searchParams.get("state");
          if (
            !state ||
            authorizationURL.searchParams.get("redirect_uri") !== relayURL
          ) {
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Invalid OAuth relay configuration",
            });
          }
          const wrappedState = Buffer.from(
            JSON.stringify({
              // biome-ignore lint/style/useNamingConvention: Ricochet protocol field
              return_to: callbackURL,
              state,
            }),
          ).toString("base64url");

          // Bind the entire envelope to the browser, including for BetterAuth's
          // cookie state strategy. Never disable BetterAuth's own state checks.
          const cookie = ctx.context.createAuthCookie("ricochet_state", {
            maxAge: 600,
          });
          await ctx.setSignedCookie(
            cookie.name,
            wrappedState,
            ctx.context.secret,
            cookie.attributes,
          );
          authorizationURL.searchParams.set("state", wrappedState);
          ctx.context.returned = {
            ...result,
            url: authorizationURL.toString(),
          };
          if (ctx.context.responseHeaders?.has("location")) {
            ctx.setHeader("location", authorizationURL.toString());
          }
        }),
      },
      {
        matcher: (ctx) =>
          ctx.path === "/oauth2/callback/:providerId" &&
          ctx.params?.providerId === "keycloak",
        handler: createAuthMiddleware(async (ctx) => {
          const cookie = ctx.context.createAuthCookie("ricochet_state", {
            maxAge: 600,
          });
          ctx.setCookie(cookie.name, "", { ...cookie.attributes, maxAge: 0 });
        }),
      },
    ],
    before: [
      {
        matcher: (ctx) =>
          ctx.path === "/oauth2/callback/:providerId" &&
          ctx.params?.providerId === "keycloak",
        handler: createAuthMiddleware(async (ctx) => {
          const wrappedState = ctx.query?.state;
          const cookie = ctx.context.createAuthCookie("ricochet_state", {
            maxAge: 600,
          });
          const expectedState = await ctx.getSignedCookie(
            cookie.name,
            ctx.context.secret,
          );
          if (
            !ctx.query ||
            typeof wrappedState !== "string" ||
            wrappedState.length > 4096 ||
            !/^[A-Za-z0-9_-]+$/u.test(wrappedState) ||
            wrappedState !== expectedState
          ) {
            throw new APIError("BAD_REQUEST", {
              message: "Invalid OAuth relay state",
            });
          }
          let decoded: unknown;
          try {
            decoded = JSON.parse(
              Buffer.from(wrappedState, "base64url").toString("utf8"),
            );
          } catch {
            throw new APIError("BAD_REQUEST", {
              message: "Invalid OAuth relay state",
            });
          }
          const envelope = relayStateSchema.safeParse(decoded);
          if (!envelope.success || envelope.data.return_to !== callbackURL) {
            throw new APIError("BAD_REQUEST", {
              message: "Invalid OAuth relay destination",
            });
          }
          ctx.query.state = envelope.data.state;
        }),
      },
    ],
  },
});
