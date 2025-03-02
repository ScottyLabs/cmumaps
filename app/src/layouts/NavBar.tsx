import { NavLink, useParams } from 'react-router';

const NavBar = () => {
  const { floorCode } = useParams();

  return (
    <nav className="absolute inset-0 z-50 h-min bg-gray-800 p-4">
      <div className="flex justify-between">
        <div className="text-xl font-bold text-white">
          CMU Maps Data Visualization
        </div>
        <div className="h-7 -translate-x-1/2 text-xl text-white">
          {floorCode}
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
