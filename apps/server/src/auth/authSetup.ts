// Authentication Setup: https://github.com/panva/openid-client/blob/HEAD/examples/passport.ts
/** biome-ignore-all lint/style/useNamingConvention: Passport naming convention */

import { RedisStore } from "connect-redis";
import type { Express as ExpressApp } from "express";
import session from "express-session";
import { buildEndSessionUrl, discovery } from "openid-client";
import type { StrategyOptions, VerifyFunction } from "openid-client/passport";
import { Strategy } from "openid-client/passport";
import passport, { type AuthenticateOptions } from "passport";
import { createClient } from "redis";
import { env } from "../env.ts";

export const AUTH_ISSUER = "https://idp.scottylabs.org/realms/scottylabs";
export const AUTH_JWKS_URI =
  "https://idp.scottylabs.org/realms/scottylabs/.well-known/openid-configuration/jwks";

declare global {
  // biome-ignore lint/style/noNamespace: Express uses global namespace
  namespace Express {
    interface User {
      sub: string;
      email?: string;
      given_name?: string;
      groups?: string[];
    }
  }
}

declare module "express-session" {
  interface SessionData {
    returnTo?: string;
  }
}

export const setupAuth = async (app: ExpressApp) => {
  const config = await discovery(
    new URL(AUTH_ISSUER),
    env.AUTH_CLIENT_ID,
    env.AUTH_CLIENT_SECRET,
  );

  // Create and configure Redis client
  const redisClient = createClient({ url: env.REDIS_URL });
  await redisClient.connect();

  // Initialize session store with Redis
  const redisStore = new RedisStore({ client: redisClient });

  // Trust the Railway proxy when deployed to production. Required for cookie to be secure.
  app.set("trust proxy", 1);

  app.use(
    session({
      store: redisStore,
      saveUninitialized: false,
      resave: true,
      secret: env.AUTH_SESSION_SECRET,
      cookie: {
        httpOnly: true,
        secure: env.APP_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      },
    }),
  );
  app.use(passport.authenticate("session"));

  const verify: VerifyFunction = (tokens, verified) => {
    verified(null, tokens.claims());
  };

  const options: StrategyOptions = {
    config,
    scope: "openid profile email offline_access",
    callbackURL: `${env.SERVER_URL}/auth/callback`,
  };

  passport.use("openid", new Strategy(options, verify));

  passport.serializeUser((user: Express.User, cb) => {
    cb(null, user);
  });

  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  // Authentication routes
  app.get(
    "/login",
    (req, _res, next) => {
      const redirectUri = req.query["redirect_uri"] as string;
      if (redirectUri) {
        // validate the redirect URI against the allowed origins regex
        const url = new URL(redirectUri);
        if (
          env.ALLOWED_ORIGINS_REGEX.split(",").some((origin) =>
            new RegExp(origin).test(url.origin),
          )
        ) {
          req.session.returnTo = redirectUri;
        }
      }
      next();
    },
    passport.authenticate("openid"),
  );

  // auth callback route similar to example in https://www.passportjs.org/concepts/oauth2/authorization/
  app.get(
    "/auth/callback",
    passport.authenticate("openid", {
      successReturnToOrRedirect: "/",
      keepSessionInfo: true,
    } as AuthenticateOptions),
  );

  app.get("/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        buildEndSessionUrl(config, {
          post_logout_redirect_uri:
            // Valid post logout redirect URIs are defined in the Keycloak client settings
            // so we can always trust the redirect URI here
            (req.query["redirect_uri"] as string) ||
            `${req.protocol}://${req.host}`,
        }).href,
      );
    });
  });
};
