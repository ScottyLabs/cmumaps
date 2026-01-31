import { createAuthClient } from "better-auth/react";
import { env } from "@/env.ts";

// https://www.better-auth.com/docs/installation#create-client-instance
const auth = createAuthClient({
  // biome-ignore lint/style/useNamingConvention: defined by better-auth
  baseURL: env.VITE_SERVER_URL,
});
export const signIn = () => {
  auth.signIn
    .social({
      provider: "keycloak",
      // biome-ignore lint/style/useNamingConvention: defined by better-auth
      callbackURL: window.location.href,
    })
    .then((result) => {
      if (result.error) {
        console.error(result.error);
      }
    });
};
export const signOut = () => {
  auth.signOut().then((result) => {
    if (result.error) {
      console.error(result.error);
    }
  });
};

export const { useSession } = auth;
