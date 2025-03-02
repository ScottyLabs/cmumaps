import { useEffect } from 'react';
import { toast } from 'react-toastify';

import {
  INVALID_BUILDING_CODE,
  INVALID_FLOOR_LEVEL,
  NO_DEFAULT_FLOOR,
} from '../../../shared/errorCode';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setErrorCode } from '../store/slices/statusSlice';

// Toast the error message based on redux error code
const useErrorToast = () => {
  const dispatch = useAppDispatch();
  const errorCode = useAppSelector((state) => state.status.errorCode);

  console.log(errorCode);

  useEffect(() => {
    if (!errorCode) {
      return;
    }

    switch (errorCode) {
      case INVALID_BUILDING_CODE:
        toast.error('The building code is invalid!');
        break;

      case NO_DEFAULT_FLOOR:
        toast.error('Please add a default floor for this building!');
        break;

      case INVALID_FLOOR_LEVEL:
        toast.error('The floor level is invalid!');
        break;
    }

    // clear the error in redux
    dispatch(setErrorCode(''));
  }, [dispatch, errorCode]);
};

export default useErrorToast;
