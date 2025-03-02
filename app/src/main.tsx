import { ClerkProvider, RedirectToSignIn, useUser } from '@clerk/clerk-react';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router';

import './index.css';
import FloorDisplay from './pages/FloorDisplay.tsx';
import Home from './pages/Home.tsx';
import { store } from './store/store.ts';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file');
}

const ProtectedRoute = () => {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return <Outlet />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <BrowserRouter>
        <Provider store={store}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route index element={<Home />} />
              <Route path=":floorCode" element={<FloorDisplay />} />
            </Route>
          </Routes>
        </Provider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
);
