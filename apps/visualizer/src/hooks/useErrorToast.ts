import { type ErrorCode, getErrorMessage } from "@cmumaps/common";

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";

// Toast the error message based on url param error code
// For it to work when not in StrictMode, we need to put this hook where the toast container is mounted
const useErrorToast = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorCode = searchParams.get("errorCode") as ErrorCode;

  useEffect(() => {
    if (!errorCode) {
      return;
    }

    toast.error(getErrorMessage(errorCode));
    navigate("?", { replace: true });
  }, [errorCode, navigate]);
};

export default useErrorToast;
