import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-react";
import type { Clerk } from "@clerk/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostHogProvider } from "posthog-js/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import env from "@/env.ts";
import App from "./App.tsx";
import "./index.css";

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

// Create a query client
const queryClient = new QueryClient();

// Render the App
createRoot(document.getElementById("root") as HTMLElement).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <ClerkLoaded>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <PostHogProvider
            apiKey={env.VITE_PUBLIC_POSTHOG_KEY || ""}
            options={posthog_options}
          >
            <StrictMode>
              <App />
            </StrictMode>
          </PostHogProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ClerkLoaded>
  </ClerkProvider>,
);
