import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";

import { ErrorCode, getErrorMessage } from "../../../shared/errorCode";

// Toast the error message based on url param error code
// Only works when not in StrictMode!
const useErrorToast = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorCode = searchParams.get("errorCode") as ErrorCode;

  useEffect(() => {
    if (!errorCode) {
      return;
    }

    toast.error(getErrorMessage(errorCode));
    navigate("/", { replace: true });
  }, [errorCode, navigate]);
};

export default useErrorToast;
