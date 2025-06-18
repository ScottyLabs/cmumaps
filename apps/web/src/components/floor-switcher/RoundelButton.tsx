import Roundel from "@/components/shared/Roundel";
import useBoundStore from "@/store";
import type { Building } from "@cmumaps/common";
import { useNavigate } from "react-router";

interface Props {
  building: Building;
}

const RoundelButton = ({ building }: Props) => {
  const navigate = useNavigate();
  const hideSearch = useBoundStore((state) => state.hideSearch);

  return (
    <button
      type="button"
      className="cursor-pointer p-1"
      onClick={() => {
        navigate(`/${building.code}`);
        hideSearch();
      }}
    >
      <Roundel code={building.code} />
    </button>
  );
};

export default RoundelButton;
