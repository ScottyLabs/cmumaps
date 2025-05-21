import { Building } from "@cmumaps/common";

import lockIcon from "@/assets/icons/half-lock.svg";

interface Props {
  building: Building;
}

const LockedView = ({ building }: Props) => {
  return (
    <div className="flex items-center">
      <p className="mr-4 ml-2">{building.name}</p>
      <div className="flex items-center gap-1 rounded-r bg-gray-200 py-2 pr-1">
        <img alt={"Lock Icon"} src={lockIcon} />
        <p className="p-1 text-[#646464]">Inaccessible</p>
      </div>
    </div>
  );
};

export default LockedView;
