import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-react";
import { Clerk } from "@clerk/types";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";

import App from "./App.tsx";
import "./index.css";
import { store } from "./store/store.ts";

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
          <Provider store={store}>
            <App />
          </Provider>
        </StrictMode>
      </BrowserRouter>
    </ClerkLoaded>
  </ClerkProvider>,
);
