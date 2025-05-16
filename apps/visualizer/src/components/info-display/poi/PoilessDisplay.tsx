import { PoiInfo } from "@cmumaps/common";
import { v4 as uuidv4 } from "uuid";

import { useNavigate } from "react-router";

import { useCreatePoiMutation } from "../../../store/api/poiApiSlice";
import InfoDisplayButton from "../shared/InfoDisplayButton";

interface Props {
  floorCode: string;
  nodeId: string;
}

const PoilessDisplay = ({ floorCode, nodeId }: Props) => {
  const navigate = useNavigate();

  const [createPoi] = useCreatePoiMutation();

  const handleCreatePoi = async () => {
    const poiId = uuidv4();
    const poiInfo: PoiInfo = { type: "", nodeId };
    const batchId = uuidv4();
    await createPoi({ floorCode, poiId, poiInfo, batchId });
    navigate(`/${floorCode}?poiId=${poiId}`);
  };

  return <InfoDisplayButton text="Create POI" handleClick={handleCreatePoi} />;
};

export default PoilessDisplay;
