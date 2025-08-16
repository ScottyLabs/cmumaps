import { useNavigate } from "react-router";
import useNavigationParams from "./useNavigationParams";

const useNavigateLocationParams = () => {
  const navigate = useNavigate();

  const { isNavOpen } = useNavigationParams();

  return (newParams: string) => {
    if (!isNavOpen) {
      navigate(newParams);
    }
  };
};

export default useNavigateLocationParams;
