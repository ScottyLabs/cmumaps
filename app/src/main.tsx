import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router';

import FloorDisplay from './FloorDisplay.tsx';
import Home from './Home.tsx';
import './index.css';
import { store } from './store/store.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route index element={<Home />} />
          <Route path=":floorCode" element={<FloorDisplay />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);
