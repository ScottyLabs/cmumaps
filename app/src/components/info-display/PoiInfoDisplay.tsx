import { v4 as uuidv4 } from "uuid";

import { SingleValue } from "react-select";

import { Pois, PoiType, PoiTypes } from "../../../../shared/types";
import {
  useDeletePoiMutation,
  useUpdatePoiMutation,
} from "../../store/api/poiApiSlice";
import Button from "./shared/Button";
import CopyIdRow from "./shared/CopyIdRow";
import SelectTypeCell from "./shared/SelectTypeCell";
import { RED_BUTTON_STYLE } from "./shared/TableCell";
import TableLayout from "./shared/TableLayout";

interface Props {
  floorCode: string;
  poiId: string;
  pois: Pois;
}

const PoiInfoDisplay = ({ floorCode, poiId, pois }: Props) => {
  const poiInfo = pois[poiId];

  const [deletePoi] = useDeletePoiMutation();
  const [updatePoi] = useUpdatePoiMutation();

  const renderEditTypeRow = () => {
    const handleChange = (
      newValue: SingleValue<{
        value: string | undefined;
        label: string | undefined;
      }>,
    ) => {
      if (newValue?.value && newValue?.value !== poiInfo.type) {
        const poiType = newValue.value as PoiType;
        const poiInfo = { ...pois[poiId], type: poiType };
        updatePoi({ floorCode, poiId, poiInfo, batchId: uuidv4() });
      }
    };

    return (
      <tr>
        <td className="border pr-4 pl-4">Type</td>
        <SelectTypeCell
          key={poiId}
          value={poiInfo.type}
          typeList={PoiTypes as readonly string[]}
          handleChange={handleChange}
        />
      </tr>
    );
  };

  const deletePoiHelper = () =>
    deletePoi({ floorCode, poiId, batchId: uuidv4() });

  return (
    <>
      <TableLayout>
        <CopyIdRow text="POI ID" id={poiId} />
        {renderEditTypeRow()}
      </TableLayout>
      <div className="mt-2 flex flex-row-reverse">
        <Button
          text="Delete POI"
          handleClick={deletePoiHelper}
          style={RED_BUTTON_STYLE + " text-base"}
        />
      </div>
    </>
  );
};

export default PoiInfoDisplay;
