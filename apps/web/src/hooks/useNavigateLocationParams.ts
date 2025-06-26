import { useQueryState } from "nuqs";
import { useLocation, useNavigate } from "react-router";

const useNavigateLocationParams = () => {
  const navigate = useNavigate();

  const [src, setSrc] = useQueryState("src");
  const [dst, setDst] = useQueryState("dst");

  const location = useLocation();
  const path = location.pathname;

  return (newParams: string) => {
    const suffix = path.split("?").slice(1).join("?");
    navigate(newParams);
    console.log(
      `Navigating to: ${newParams}${suffix !== "" ? `?${suffix}` : ""}`,
    );
    setSrc(src);
    setDst(dst);
  };
};

export default useNavigateLocationParams;
