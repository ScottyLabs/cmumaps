/** biome-ignore-all lint/style/useNamingConvention: defined by better-auth */
import { betterAuth } from "better-auth";
import { genericOAuth, keycloak } from "better-auth/plugins";
import { env } from "../env.ts";

// https://www.better-auth.com/docs/installation#create-a-better-auth-instance
// https://www.better-auth.com/docs/plugins/generic-oauth#pre-configured-provider-helpers
export const auth = betterAuth({
  baseURL: env.SERVER_URL,
  trustedOrigins: [env.BETTER_AUTH_URL],
  plugins: [
    genericOAuth({
      config: [
        keycloak({
          clientId: env.AUTH_CLIENT_ID,
          clientSecret: env.AUTH_CLIENT_SECRET,
          issuer: env.AUTH_ISSUER,
          redirectURI: `${env.SERVER_URL}/api/auth/oauth2/callback/keycloak`,
          scopes: ["openid", "email", "profile", "offline_access"],
        }),
      ],
    }),
  ],
});
