import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-react";
import { Clerk } from "@clerk/types";
import { PostHogProvider } from "posthog-js/react";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import App from "./App.tsx";
import "./index.css";

const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
};

// https://clerk.com/docs/components/control/clerk-loaded
declare global {
  interface Window {
    Clerk: Clerk;
  }
}

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <ClerkLoaded>
      <BrowserRouter>
        <StrictMode>
          <PostHogProvider
            apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
            options={options}
          >
            <App />
          </PostHogProvider>
        </StrictMode>
      </BrowserRouter>
    </ClerkLoaded>
  </ClerkProvider>,
);
