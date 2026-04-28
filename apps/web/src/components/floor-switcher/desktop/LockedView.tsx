import type { Building } from "@cmumaps/common";
import { MdLock } from "react-icons/md";

interface Props {
  building: Building;
}

const LockedView = ({ building }: Props) => (
  <div className="flex items-center">
    <p className="mr-4 ml-2">{building.name}</p>
    <div className="flex items-center self-stretch rounded-r bg-gray-200 px-2.5 text-gray-600">
      <MdLock size={20} />
    </div>
  </div>
);

export { LockedView };
