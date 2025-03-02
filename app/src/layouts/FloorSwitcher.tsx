import { useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { FaArrowDown } from 'react-icons/fa';

import useFloorInfo from '../hooks/useFloorInfo';
import { useGetBuildingFloorsQuery } from '../store/api/buildingsApiSlice';

interface Props {
  floorCode: string;
}

const FloorSwitcher = ({ floorCode }: Props) => {
  const [fullDisplayMode, setFullDisplayMode] = useState<boolean>(false);
  const { buildingCode, floorLevel: floorLevelSelected } =
    useFloorInfo(floorCode);

  const { data: floorLevels } = useGetBuildingFloorsQuery(buildingCode);

  console.log(floorLevels);

  return;

  if (!floorLevels) {
    return;
  }

  const renderFullDisplayMode = () =>
    floorLevels.map((floorLevel) => (
      <td
        key={floorLevel}
        className={
          'cursor-pointer border border-black px-4 ' +
          (floorLevel == floorLevelSelected ? 'font-bold' : '')
        }
        onClick={() => {
          // exit full display mode in case clicking on the same floor level
          setFullDisplayMode(false);
          router.push(`${buildingCode}-${floorLevel}`);
        }}
      >
        {floorLevel}
      </td>
    ));

  const renderNotFullDisplayMode = () => {
    const index = floorLevels.indexOf(floorLevelSelected);

    const handleDownClick = () => {
      if (index != 0) {
        router.push(`${buildingCode}-${floorLevels[index - 1]}`);
      }
    };

    const renderDownArrow = () => (
      <td className="flex items-center border-x border-black p-1">
        <FaArrowDown
          className={
            index == 0 ? 'cursor-pointer text-gray-400' : 'cursor-pointer'
          }
          onClick={handleDownClick}
        />
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
                'm-[1px] h-1 w-1 rounded-full ' +
                (floorLevel == floorLevelSelected ? 'bg-black' : 'bg-gray-400')
              }
            ></div>
          ))}
        </div>
      </td>
    );

    const handleUpClick = () => {
      if (index != floorLevels.length - 1) {
        router.push(`${buildingCode}-${floorLevels[index + 1]}`);
      }
    };

    const renderUpArrow = () => (
      <td className="flex items-center border-l border-black p-1">
        <FaArrowUp
          className={
            index == floorLevels.length - 1 ? 'text-gray-400' : 'cursor-pointer'
          }
          onClick={handleUpClick}
        />
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
          <tbody className="flex">
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
