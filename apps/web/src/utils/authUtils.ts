import { env } from "@/env";

export const signIn = () => {
  window.location.href = `${env.VITE_SERVER_URL}/login?redirect_uri=${window.location.href}`;
};

export const signOut = () => {
  window.location.href = `${env.VITE_SERVER_URL}/logout?redirect_uri=${window.location.href}`;
};
