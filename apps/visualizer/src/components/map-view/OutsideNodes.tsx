import type { GeoNode } from "@cmumaps/common";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useGetFloorNodesQuery } from "@/store/api/floorDataApiSlice";

const OutsideNodes = ({
  mapRef,
}: {
  mapRef: React.RefObject<mapkit.Map | null>;
}) => {
  const { data: nodes } = useGetFloorNodesQuery("outside");

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !nodes) {
      return;
    }

    // Add nodes as circle overlays to the map
    const overlays: mapkit.Overlay[] = [];
    Object.entries(nodes).forEach(([nodeId, node]: [string, GeoNode]) => {
      const circleOverlay = new mapkit.CircleOverlay(
        new mapkit.Coordinate(node.pos.latitude, node.pos.longitude),
        1,
        { style: new mapkit.Style({ fillOpacity: 1.0 }) },
      );
      circleOverlay.data = { nodeId };

      //Copy nodeId to clipboard when user clicks on the node
      circleOverlay.addEventListener("select", () => {
        navigator.clipboard.writeText(nodeId);
        toast.success("Copied nodeId!");
      });

      overlays.push(circleOverlay);
      map.addOverlay(circleOverlay);
    });

    return () => {
      map.removeOverlays(overlays);
    };
  }, [mapRef, nodes]);

  return null;
};

export default OutsideNodes;
