import { Polygon } from "mapkit-react";
import path from "@/assets/carnival/json/buggy-path.json" with { type: "json" };

import { useLocationParams } from "@/hooks/useLocationParams";

const BuggyPath = () => {
  const { carnivalEvent } = useLocationParams();

  if (carnivalEvent !== "buggy") return;

  return (
    <Polygon
      points={path}
      enabled={false}
      strokeColor="#0000aa"
      fillColor="0000ff"
      fillOpacity={0.1}
      lineWidth={3}
    />
  );
};

export { BuggyPath };
