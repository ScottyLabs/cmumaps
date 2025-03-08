import { NavLink } from "react-router";

import { extractBuildingCode } from "../../../../shared/utils/floorCodeUtils";
import { useGetBuildingNameQuery } from "../../store/api/buildingApiSlice";

interface Props {
  floorCode: string;
}

const NavBar = ({ floorCode }: Props) => {
  const buildingCode = extractBuildingCode(floorCode);
  const { data: name } = useGetBuildingNameQuery(buildingCode);

  return (
    <nav className="absolute inset-0 z-50 h-min bg-gray-800 p-4">
      <div className="flex justify-between">
        <div className="text-xl font-bold text-white">
          CMU Maps Data Visualization
        </div>
        <div className="fixed top-4 left-1/2 h-7 -translate-x-1/2 text-xl text-white">
          {name ? name : ""}
        </div>
        <NavLink
          to="/"
          className="mr-2 cursor-pointer text-lg text-white hover:text-gray-400"
        >
          Back
        </NavLink>
      </div>
    </nav>
  );
};

export default NavBar;
