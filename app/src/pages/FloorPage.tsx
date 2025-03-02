import { useParams, Navigate } from 'react-router';

import { ErrorCode } from '../../../shared/errorCode';
import { useGetDefaultFloorQuery } from '../store/api/buildingsApiSlice';
import { useAppDispatch } from '../store/hooks';
import { setErrorCode } from '../store/slices/statusSlice';

const FloorPage = () => {
  const { floorCode } = useParams();
  const dispatch = useAppDispatch();

  if (!floorCode) {
    return <Navigate to="/" />;
  }

  if (floorCode?.split('-').length !== 2) {
    const { data: defaultFloor, error } = useGetDefaultFloorQuery(floorCode);

    if (error && 'data' in error) {
      const errorData = error.data as { code: ErrorCode };
      dispatch(setErrorCode(errorData.code));
      return <Navigate to="/" />;
    }

    if (defaultFloor) {
      return <Navigate to={`/${floorCode}-${defaultFloor}`} />;
    }
  }

  return <div>FloorPage</div>;
};

export default FloorPage;
