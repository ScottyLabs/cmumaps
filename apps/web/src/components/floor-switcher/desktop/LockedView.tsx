import type { Building } from "@cmumaps/common";
import lockIcon from "@/assets/icons/half-lock.svg";

interface Props {
  building: Building;
}

const LockedView = ({ building }: Props) => (
  <div className="flex items-center">
    <p className="mr-4 ml-2">{building.name}</p>
    <div className="flex items-center self-stretch rounded-r bg-gray-200 px-2.5">
      <img alt="Lock Icon" src={lockIcon} className="h-6 w-auto" />
    </div>
  </div>
);

export { LockedView };
