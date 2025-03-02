import { useParams, Navigate } from 'react-router';

import { ErrorCode } from '../../../shared/errorCode';
import { useGetDefaultFloorQuery } from '../store/api/buildingsApiSlice';

const FloorPage = () => {
  const { floorCode } = useParams();

  // Skip the query if don't need to retrieve the default floor
  const { data: defaultFloor, error } = useGetDefaultFloorQuery(
    floorCode || '',
    { skip: !floorCode || floorCode.split('-').length === 2 },
  );

  if (!floorCode) {
    return <Navigate to="/" />;
  }

  if (floorCode?.split('-').length !== 2) {
    if (error && 'data' in error && 'code' in (error.data as object)) {
      const errorData = error.data as { code: ErrorCode };
      return <Navigate to={`/?errorCode=${errorData.code}`} />;
    }

    if (defaultFloor) {
      return <Navigate to={`/${floorCode}-${defaultFloor}`} replace />;
    }
  }

  return <div>FloorPage</div>;
};

export default FloorPage;
