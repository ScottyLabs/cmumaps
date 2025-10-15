import { useRouterState } from "@tanstack/react-router";

const ViewSwitch = () => {
  const { location } = useRouterState();
  const floorView = location.pathname.split("/")[1] === "floors";

  return (
    <div className="absolute top-16 right-4 z-50">
      <button
        type="button"
        className="cursor-pointer rounded-md bg-blue-500 p-2 text-white"
      >
        {floorView ? "View in Map" : "View Floor"}
      </button>
    </div>
  );
};

export default ViewSwitch;
