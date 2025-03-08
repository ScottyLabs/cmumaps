import { SingleValue } from "react-select";
import { toast } from "react-toastify";

import { Pois, PoiTypes } from "../../../../../shared/types";
import { renderCell } from "../../../utils/displayUtils";
import SelectTypeCell from "./SelectTypeCell";

interface Props {
  floorCode: string;
  poiId: string;
  pois: Pois;
}

const PoiInfoDisplay = ({ poiId, pois }: Props) => {
  const poiType = pois[poiId];

  const renderRoomIdRow = () => {
    const copyId = () => {
      navigator.clipboard.writeText(poiId);
      toast.success("Copied!");
    };

    return (
      <tr>
        {renderCell("POI ID")}
        <td className="border px-4 py-2">
          <button
            className="cursor-pointer border p-1 hover:bg-slate-700"
            onClick={copyId}
          >
            Copy POI ID
          </button>
        </td>
      </tr>
    );
  };

  const renderEditTypeRow = () => {
    const handleChange =
      () =>
      async (
        newValue: SingleValue<{
          value: string | undefined;
          label: string | undefined;
        }>,
      ) => {
        if (newValue?.value && newValue?.value !== poiType) {
          console.log(newValue.value);
        }
      };

    return (
      <tr>
        <td className="border pr-4 pl-4">Type</td>
        <SelectTypeCell
          key={poiId}
          value={poiType}
          typeList={PoiTypes as readonly string[]}
          handleChange={handleChange}
        />
      </tr>
    );
  };

  return (
    <>
      <table className="w-72 table-fixed">
        <thead>
          <tr>
            {renderCell("Property", "font-bold w-28")}
            {renderCell("Value", "font-bold")}
          </tr>
        </thead>
        <tbody>
          {renderRoomIdRow()}
          {renderEditTypeRow()}
        </tbody>
      </table>
    </>
  );
};

export default PoiInfoDisplay;
