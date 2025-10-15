import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import MyToastContainer from "../../components/shared/MyToastContainer";
import FloorSwitcher from "../../components/ui-layout/FloorSwitcher";
import HelpInfo from "../../components/ui-layout/HelpInfo";
import LiveUserCount from "../../components/ui-layout/LiveUserCount";
import MainDisplay from "../../components/ui-layout/MainDisplay";
import ModeDisplay from "../../components/ui-layout/ModeDisplay";
import NavBar from "../../components/ui-layout/NavBar";
import ViewSwitch from "../../components/ui-layout/ViewSwitch";

const floorSearchSchema = z.object({
  nodeId: z.string().optional(),
  roomId: z.string().optional(),
  poiId: z.string().optional(),
});

export const Route = createFileRoute("/floors/$floorCode")({
  validateSearch: zodValidator(floorSearchSchema),
  component: Floor,
});

function Floor() {
  const { floorCode } = Route.useParams();
  return (
    <>
      <NavBar floorCode={floorCode} />
      <LiveUserCount />
      <ViewSwitch />
      <MainDisplay floorCode={floorCode} />
      <ModeDisplay />
      <FloorSwitcher floorCode={floorCode} />
      <HelpInfo />
      <MyToastContainer />
    </>
  );
}

export default Floor;
