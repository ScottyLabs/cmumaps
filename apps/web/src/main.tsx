import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-react";
import type { Clerk } from "@clerk/types";
import { PostHogProvider } from "posthog-js/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import "./index.css";
import env from "@/env.ts";

// https://clerk.com/docs/components/control/clerk-loaded
declare global {
  interface Window {
    Clerk: Clerk;
  }
}

// Posthog settings
const posthog_options = {
  api_host: env.VITE_PUBLIC_POSTHOG_HOST,
};

// Clerk settings
const PUBLISHABLE_KEY = env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

// Render the App
createRoot(document.getElementById("root") as HTMLElement).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <ClerkLoaded>
      <BrowserRouter>
        <StrictMode>
          <PostHogProvider
            apiKey={env.VITE_PUBLIC_POSTHOG_KEY || ""}
            options={posthog_options}
          >
            <App />
          </PostHogProvider>
        </StrictMode>
      </BrowserRouter>
    </ClerkLoaded>
  </ClerkProvider>,
);
