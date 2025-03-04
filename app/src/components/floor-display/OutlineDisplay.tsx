import { skipToken } from "@reduxjs/toolkit/query";

import useClerkToken from "../../hooks/useClerkToken";
import useFloorInfo from "../../hooks/useFloorInfo";
import { useGetFloorOutlineQuery } from "../../store/api/s3ApiSlice";

interface Props {
  floorCode: string;
}

const OutlineDisplay = ({ floorCode }: Props) => {
  const { buildingCode } = useFloorInfo(floorCode);
  const filePath = `${buildingCode}/${floorCode}.json`;
  const token = useClerkToken();
  const { data: outlineData } = useGetFloorOutlineQuery(
    token ? { filePath, token } : skipToken,
  );

  console.log(outlineData);

  return <></>;
};

export default OutlineDisplay;
