import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { toast } from 'react-toastify';

import { ErrorCode, getErrorMessage } from '../../../shared/errorCode';

// Toast the error message based on url param error code
// Only works when not in StrictMode!
const useErrorToast = () => {
  const [searchParams] = useSearchParams();
  const errorCode = searchParams.get('errorCode') as ErrorCode;

  useEffect(() => {
    if (!errorCode) {
      return;
    }

    toast.error(getErrorMessage(errorCode));
  }, [errorCode]);
};

export default useErrorToast;
