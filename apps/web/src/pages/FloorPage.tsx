import { useParams, Navigate } from "react-router";

import { ErrorCode } from "../../../../packages/common/dist/errorCode";
import Loader from "../components/shared/Loader";
import MyToastContainer from "../components/shared/MyToastContainer";
import FloorSwitcher from "../components/ui-layout/FloorSwitcher";
import HelpInfo from "../components/ui-layout/HelpInfo";
import LiveUserCount from "../components/ui-layout/LiveUserCount";
import MainDisplay from "../components/ui-layout/MainDisplay";
import ModeDisplay from "../components/ui-layout/ModeDisplay";
import NavBar from "../components/ui-layout/NavBar";
import { useGetDefaultFloorQuery } from "../store/api/buildingApiSlice";

const FloorPage = () => {
  const { floorCode } = useParams();

  // Skip the query if don't need to retrieve the default floor
  const { data: defaultFloor, error } = useGetDefaultFloorQuery(
    floorCode || "",
    { skip: !floorCode || floorCode.split("-").length === 2 },
  );

  if (!floorCode) {
    return <Navigate to="/" />;
  }

  if (floorCode.split("-").length !== 2) {
    if (error && "data" in error && "code" in (error.data as object)) {
      const errorData = error.data as { code: ErrorCode };
      return <Navigate to={`/?errorCode=${errorData.code}`} />;
    }

    if (defaultFloor) {
      return <Navigate to={`/${floorCode}-${defaultFloor}`} replace />;
    } else {
      return <Loader loadingText="Fetching default floor" />;
    }
  }

  return (
    <>
      <NavBar floorCode={floorCode} />
      <LiveUserCount />
      <MainDisplay floorCode={floorCode} />
      <ModeDisplay />
      <FloorSwitcher floorCode={floorCode} />
      <HelpInfo />
      <MyToastContainer />
    </>
  );
};

export default FloorPage;
