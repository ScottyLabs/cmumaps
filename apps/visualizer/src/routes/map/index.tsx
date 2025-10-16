import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/map/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/map/"!</div>;
}
