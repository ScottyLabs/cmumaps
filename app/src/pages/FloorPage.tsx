import { useParams, Navigate } from 'react-router';

import { useGetDefaultFloorQuery } from '../store/api/buildingsApiSlice';

const FloorPage = () => {
  const { floorCode } = useParams();

  if (!floorCode) {
    return <Navigate to="/" />;
  }

  if (floorCode?.split('-').length !== 2) {
    const { data: defaultFloor } = useGetDefaultFloorQuery(floorCode);
    if (defaultFloor) {
      return <Navigate to={`/${floorCode}-${defaultFloor}`} />;
    }
  }

  return <div>FloorPage</div>;
};

export default FloorPage;
