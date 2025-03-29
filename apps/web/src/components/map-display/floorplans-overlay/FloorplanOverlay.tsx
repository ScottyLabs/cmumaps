import { Floor } from "@cmumaps/common";

import { useGetFloorRoomsQuery } from "@/store/features/api/apiSlice";
import { getFloorCode } from "@/utils/floorUtils";

interface Props {
  floor: Floor;
}

const FloorplanOverlay = ({ floor }: Props) => {
  const { data: rooms } = useGetFloorRoomsQuery(
    getFloorCode(floor.buildingCode, floor.level),
  );

  console.log(rooms);

  return <div>FloorplanOverlay</div>;
};

export default FloorplanOverlay;
