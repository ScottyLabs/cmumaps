import { Routes, Route } from 'react-router';

import FloorDisplay from './FloorDisplay';
import Home from './Home';

const AppRouter = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path=":floorCode" element={<FloorDisplay />} />
    </Routes>
  );
};

export default AppRouter;
