import buggyPath from "@public/assets/carnival/json/buggy-path.json";
import { Polyline } from "mapkit-react";

const BuggyPath = () => {
  return <Polyline points={buggyPath} strokeColor="red" lineWidth={3} />;
};

export default BuggyPath;
