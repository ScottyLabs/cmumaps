import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostHogProvider } from "posthog-js/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import env from "@/env.ts";
import App from "./App.tsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { NuqsAdapter } from "nuqs/adapters/react";

// Posthog settings
const posthog_options = {
  api_host: env.VITE_PUBLIC_POSTHOG_HOST,
};

// Create a query client
const queryClient = new QueryClient();

// Render the App
createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <ClerkProvider publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <PostHogProvider
            apiKey={env.VITE_PUBLIC_POSTHOG_KEY || ""}
            options={posthog_options}
          >
            <StrictMode>
              <App />
            </StrictMode>
          </PostHogProvider>
        </NuqsAdapter>
      </QueryClientProvider>
    </ClerkProvider>
  </BrowserRouter>,
);
