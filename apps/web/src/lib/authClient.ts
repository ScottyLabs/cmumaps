import { createAuthClient } from "better-auth/react";
import { env } from "@/env.ts";

// https://www.better-auth.com/docs/installation#create-client-instance
const auth = createAuthClient({
  // biome-ignore lint/style/useNamingConvention: defined by better-auth
  baseURL: env.VITE_SERVER_URL,
});

const POST_LOGIN_CALLBACK_URL_KEY = "postLoginCallbackURL";

const sanitizeCallbackUrl = (callbackUrl: string): string => {
  try {
    const parsedCallbackUrl = new URL(callbackUrl, window.location.origin);
    if (parsedCallbackUrl.origin !== window.location.origin) {
      return window.location.href;
    }
    return parsedCallbackUrl.toString();
  } catch {
    return window.location.href;
  }
};

const consumePostLoginCallbackUrl = (): string | null => {
  const postLoginCallbackUrl = sessionStorage.getItem(
    POST_LOGIN_CALLBACK_URL_KEY,
  );
  if (!postLoginCallbackUrl) {
    return null;
  }

  sessionStorage.removeItem(POST_LOGIN_CALLBACK_URL_KEY);
  return postLoginCallbackUrl;
};

export const setPostLoginCallbackUrl = (callbackUrl: string) => {
  sessionStorage.setItem(
    POST_LOGIN_CALLBACK_URL_KEY,
    sanitizeCallbackUrl(callbackUrl),
  );
};

export const clearPostLoginCallbackUrl = () => {
  sessionStorage.removeItem(POST_LOGIN_CALLBACK_URL_KEY);
};

export const signIn = () => {
  const callbackUrl = sanitizeCallbackUrl(
    consumePostLoginCallbackUrl() ?? window.location.href,
  );

  auth.signIn
    .social({
      provider: "keycloak",
      // biome-ignore lint/style/useNamingConvention: defined by better-auth
      callbackURL: callbackUrl,
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
