import {
  ClerkLoaded,
  ClerkProvider,
  RedirectToSignIn,
  useUser,
} from "@clerk/clerk-react";
import type { Clerk } from "@clerk/types";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";

import "./index.css";
import FloorPage from "./pages/FloorPage";
import Home from "./pages/Home";
import { USE_STRICT_MODE } from "./settings";
import { store } from "./store/store";

// https://clerk.com/docs/components/control/clerk-loaded
declare global {
  interface Window {
    Clerk: Clerk;
  }
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

const ProtectedRoute = () => {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return <Outlet />;
};

const AppContent = () => (
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <ClerkLoaded>
      <BrowserRouter>
        <Provider store={store}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route index element={<Home />} />
              <Route path=":floorCode" element={<FloorPage />} />
            </Route>
          </Routes>
        </Provider>
      </BrowserRouter>
    </ClerkLoaded>
  </ClerkProvider>
);

createRoot(document.getElementById("root") as HTMLElement).render(
  USE_STRICT_MODE ? (
    <StrictMode>
      <AppContent />
    </StrictMode>
  ) : (
    <AppContent />
  ),
);
