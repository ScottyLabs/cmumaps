import { useQueryState } from "nuqs";
import { useEffect, useRef } from "react";
import { $api } from "@/api/client";
import { useBoundStore } from "@/store/index.ts";

const useFocusedFloorParam = () => {
  const [floorParam, setFloorParam] = useQueryState("floor", {
    history: "replace",
  });
  const focusedFloor = useBoundStore((state) => state.focusedFloor);
  const focusFloor = useBoundStore((state) => state.focusFloor);
  const { data: buildings } = $api.useQuery("get", "/buildings");

  const restored = useRef(false);

  // restore once after buildings are available
  useEffect(() => {
    if (restored.current || !buildings || !floorParam) {
      return;
    }
    const dash = floorParam.indexOf("-");
    if (dash <= 0) {
      return;
    }
    const buildingCode = floorParam.slice(0, dash);
    const level = floorParam.slice(dash + 1);
    if (
      buildings[buildingCode]?.floors.includes(level) &&
      (focusedFloor?.buildingCode !== buildingCode ||
        focusedFloor?.level !== level)
    ) {
      focusFloor({ buildingCode, level });
    }
    restored.current = true;
  }, [buildings, floorParam, focusFloor, focusedFloor]);

  // mirror store -> url
  useEffect(() => {
    const next = focusedFloor
      ? `${focusedFloor.buildingCode}-${focusedFloor.level}`
      : null;
    if (next !== floorParam) {
      setFloorParam(next);
    }
  }, [focusedFloor, floorParam, setFloorParam]);
};

export { useFocusedFloorParam };
