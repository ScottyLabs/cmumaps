import { Pois, PoiType, PoiTypes } from "@cmumaps/common";
import { v4 as uuidv4 } from "uuid";

import { SingleValue } from "react-select";

import {
  useDeletePoiMutation,
  useUpdatePoiMutation,
} from "../../../store/api/poiApiSlice";
import CopyIdRow from "../shared/CopyIdRow";
import InfoDisplayButton from "../shared/InfoDisplayButton";
import SelectTypeCell from "../shared/SelectTypeCell";
import { RED_BUTTON_STYLE } from "../shared/TableCell";
import TableLayout from "../shared/TableLayout";

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
        updatePoi({ floorCode, poiId, poiType, batchId: uuidv4() });
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
        <InfoDisplayButton
          text="Delete POI"
          handleClick={deletePoiHelper}
          style={RED_BUTTON_STYLE + " text-base"}
        />
      </div>
    </>
  );
};

export default PoiInfoDisplay;
