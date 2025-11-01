import { useNavigate, useRouterState } from "@tanstack/react-router";

interface Props {
  floorCode: string;
}

const ViewSwitch = ({ floorCode }: Props) => {
  const { location } = useRouterState();
  const navigate = useNavigate();
  const floorView = location.pathname.split("/")[1] === "floors";

  return (
    <div className="absolute top-16 right-4 z-50">
      <button
        type="button"
        className="cursor-pointer rounded-md bg-blue-500 p-2 text-white"
        onClick={() => {
          if (floorView) {
            navigate({ to: "/map/$floorCode", params: { floorCode } });
          } else {
            navigate({ to: "/floors/$floorCode", params: { floorCode } });
          }
        }}
      >
        {floorView ? "View in Map" : "View Floor"}
      </button>
    </div>
  );
};

export default ViewSwitch;
