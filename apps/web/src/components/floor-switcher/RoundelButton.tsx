import Roundel from "@/components/shared/Roundel";
import useNavigateLocationParams from "@/hooks/useNavigateLocationParams";
import useBoundStore from "@/store";
import type { Building } from "@cmumaps/common";
import { useQueryState } from "nuqs";

interface Props {
  building: Building;
}

const RoundelButton = ({ building }: Props) => {
  const [src, setSrc] = useQueryState("src");
  const navigate = useNavigateLocationParams();
  const hideSearch = useBoundStore((state) => state.hideSearch);
  const isNavigating = useBoundStore((state) => state.isNavigating);

  return (
    <button
      type="button"
      className="cursor-pointer p-1"
      onClick={() => {
        if (!src || src === "") {
          navigate(`/${building.code}`);
        } else if (!isNavigating) {
          setSrc(building.code);
        }

        hideSearch();
      }}
    >
      <Roundel code={building.code} />
    </button>
  );
};

export default RoundelButton;
