import { v4 as uuidv4 } from "uuid";

import { SingleValue } from "react-select";

import { Pois, PoiType, PoiTypes } from "../../../../../shared/types";
import { useUpdatePoiMutation } from "../../../store/api/poiApiSlice";
import CopyIdRow from "../shared/CopyIdRow";
import TableLayout from "../shared/TableLayout";
import SelectTypeCell from "./SelectTypeCell";

interface Props {
  floorCode: string;
  poiId: string;
  pois: Pois;
}

const PoiInfoDisplay = ({ floorCode, poiId, pois }: Props) => {
  const poiType = pois[poiId];

  const [updatePoi] = useUpdatePoiMutation();

  const renderEditTypeRow = () => {
    const handleChange = (
      newValue: SingleValue<{
        value: string | undefined;
        label: string | undefined;
      }>,
    ) => {
      if (newValue?.value && newValue?.value !== poiType) {
        const poiType = newValue.value as PoiType;
        updatePoi({ floorCode, poiId, poiType, batchId: uuidv4() });
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
    <TableLayout>
      <CopyIdRow text="POI ID" id={poiId} />
      {renderEditTypeRow()}
    </TableLayout>
  );
};

export default PoiInfoDisplay;
