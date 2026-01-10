import { useNavigate } from "react-router";
import { useNavPaths } from "./useNavigationParams.ts";

const useNavigateLocationParams = () => {
  const navigate = useNavigate();

  const { isNavOpen } = useNavPaths();

  return async (newParams: string) => {
    if (!isNavOpen) {
      await navigate(newParams);
    }
  };
};

export { useNavigateLocationParams };
