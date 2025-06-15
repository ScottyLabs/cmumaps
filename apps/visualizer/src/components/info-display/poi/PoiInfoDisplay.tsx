import type { Pois } from "@cmumaps/common";

import CopyIdRow from "../shared/CopyIdRow";
import TableLayout from "../shared/TableLayout";
import PoiDeleteButton from "./PoiDeleteButton";
import PoiEditTypeRow from "./PoiEditTypeRow";

interface Props {
  floorCode: string;
  poiId: string;
  pois: Pois;
}

const PoiInfoDisplay = ({ floorCode, poiId, pois }: Props) => {
  const poiInfo = pois[poiId];

  return (
    <>
      <TableLayout>
        <CopyIdRow text="POI ID" id={poiId} />
        <PoiEditTypeRow floorCode={floorCode} poiId={poiId} poiInfo={poiInfo} />
      </TableLayout>
      <PoiDeleteButton floorCode={floorCode} poiId={poiId} />
    </>
  );
};

export default PoiInfoDisplay;
