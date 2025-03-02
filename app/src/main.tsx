import { ClerkProvider } from '@clerk/clerk-react';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router';

import FloorDisplay from './FloorDisplay.tsx';
import Home from './Home.tsx';
import './index.css';
import { store } from './store/store.ts';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <BrowserRouter>
        <Provider store={store}>
          <Routes>
            <Route index element={<Home />} />
            <Route path=":floorCode" element={<FloorDisplay />} />
          </Routes>
        </Provider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
);
