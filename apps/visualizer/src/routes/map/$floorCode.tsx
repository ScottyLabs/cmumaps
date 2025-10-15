import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/map/$floorCode")({
  component: MapView,
});

function MapView() {
  const { floorCode } = Route.useParams();
  return <div>Hello {floorCode}</div>;
}
