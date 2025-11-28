import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostHogProvider } from "posthog-js/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import env from "@/env.ts";
import App from "./App.tsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import type { Clerk } from "@clerk/types";
import { NuqsAdapter } from "nuqs/adapters/react";
import posthog from "posthog-js";

// https://clerk.com/docs/components/control/clerk-loaded
declare global {
  interface Window {
    Clerk: Clerk;
  }
}

// Initialize Posthog https://posthog.com/docs/libraries/react
posthog.init(env.VITE_PUBLIC_POSTHOG_KEY || "", {
  api_host: env.VITE_PUBLIC_POSTHOG_HOST,
});

// Create a query client
const queryClient = new QueryClient();

// Render the App
createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <ClerkProvider publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <PostHogProvider client={posthog}>
            <StrictMode>
              <App />
            </StrictMode>
          </PostHogProvider>
        </NuqsAdapter>
      </QueryClientProvider>
    </ClerkProvider>
  </BrowserRouter>,
);
