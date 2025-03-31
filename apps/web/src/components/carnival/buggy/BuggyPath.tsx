import { Polyline } from "mapkit-react";

import buggyPath from "@/assets/carnival/json/buggy-path.json";

const BuggyPath = () => {
  return <Polyline points={buggyPath} strokeColor="red" lineWidth={6} />;
};

export default BuggyPath;
