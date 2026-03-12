import type { Building } from "@cmumaps/common";
import lockIcon from "@/assets/icons/half-lock.svg";

interface Props {
  building: Building;
}

const LockedView = ({ building }: Props) => (
  <div className="flex items-center">
    <p className="mr-4 ml-2">{building.name}</p>
    <div className="flex items-center rounded-r bg-gray-200 p-2">
      <img alt="Lock Icon" src={lockIcon} />
    </div>
  </div>
);

export { LockedView };
