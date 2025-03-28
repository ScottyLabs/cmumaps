import { useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import { NavLink } from "react-router";

import useFloorInfo from "../../hooks/useFloorInfo";
import { useGetBuildingFloorsQuery } from "../../store/api/buildingApiSlice";

interface Props {
  floorCode: string;
}

const FloorSwitcher = ({ floorCode }: Props) => {
  const [fullDisplayMode, setFullDisplayMode] = useState<boolean>(false);
  const { buildingCode, floorLevel: floorLevelSelected } =
    useFloorInfo(floorCode);

  const { data: floorLevels } = useGetBuildingFloorsQuery(buildingCode);

  if (!floorLevels) {
    return;
  }

  const renderFullDisplayMode = () =>
    floorLevels.map((floorLevel) => (
      <td key={floorLevel} className="border border-black">
        <NavLink
          to={`/${buildingCode}-${floorLevel}`}
          className={
            "cursor-pointer px-4 " +
            (floorLevel == floorLevelSelected ? "font-bold" : "")
          }
          onClick={() => {
            // exit full display mode in case clicking on the same floor level
            setFullDisplayMode(false);
          }}
        >
          {" "}
          {floorLevel}
        </NavLink>
      </td>
    ));

  const renderNotFullDisplayMode = () => {
    const index = floorLevels.indexOf(floorLevelSelected);

    const renderDownArrow = () => (
      <td className="border-x border-black">
        {index !== 0 ? (
          <NavLink
            to={`/${buildingCode}-${floorLevels[index - 1]}`}
            className="flex h-full w-full cursor-pointer items-center p-1"
          >
            <FaArrowDown />
          </NavLink>
        ) : (
          <div className="flex h-full w-full items-center p-1 text-gray-400">
            <FaArrowDown />
          </div>
        )}
      </td>
    );

    const renderFloorLevelCell = () => (
      <td
        className="cursor-pointer text-lg"
        onClick={() => setFullDisplayMode(true)}
      >
        <div className="px-2 text-center">{floorLevelSelected}</div>
        <div className="flex justify-center">
          {floorLevels.map((floorLevel) => (
            <div
              key={floorLevel}
              className={
                "m-[1px] h-1 w-1 rounded-full " +
                (floorLevel == floorLevelSelected ? "bg-black" : "bg-gray-400")
              }
            ></div>
          ))}
        </div>
      </td>
    );

    const renderUpArrow = () => (
      <td className="border-l border-black">
        {index != floorLevels.length - 1 ? (
          <NavLink
            to={`/${buildingCode}-${floorLevels[index + 1]}`}
            className="flex h-full w-full cursor-pointer items-center p-1"
          >
            <FaArrowUp />
          </NavLink>
        ) : (
          <div className="flex h-full w-full items-center p-1 text-gray-400">
            <FaArrowUp />
          </div>
        )}
      </td>
    );

    return (
      <>
        <td className="border-black p-1">
          <p className="m-0 px-1">Floor Switcher:</p>
        </td>
        {renderDownArrow()}
        {renderFloorLevelCell()}
        {renderUpArrow()}
      </>
    );
  };

  return (
    <div className="fixed bottom-2 left-1/2 z-50 -translate-x-1/2">
      <div className="rounded border border-black bg-gray-50">
        <table>
          <tbody>
            <tr className="flex">
              {fullDisplayMode
                ? renderFullDisplayMode()
                : renderNotFullDisplayMode()}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FloorSwitcher;
