import { useQueryState } from "nuqs";
import { useNavigate } from "react-router";

const useNavigateLocationParams = () => {
  const navigate = useNavigate();

  const [src, setSrc] = useQueryState("src");
  const [dst, setDst] = useQueryState("dst");

  return (newParams: string) => {
    navigate(newParams);
    setSrc(src);
    setDst(dst);
  };
};

export default useNavigateLocationParams;
