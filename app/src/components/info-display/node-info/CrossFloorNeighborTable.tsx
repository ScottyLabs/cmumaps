import { NavLink } from "react-router";
import { toast } from "react-toastify";

import { EdgeInfo } from "../../../../../shared/types";
import { renderCell } from "../../../utils/displayUtils";

interface Props {
  floorCode: string;
  nodeId: string;
  neighbors: Record<string, EdgeInfo>;
  differentFloorNeighbors: Record<string, EdgeInfo>;
}

const DifferentFloorNeighborTable = ({
  floorCode,
  nodeId,
  neighbors,
  differentFloorNeighbors,
}: Props) => {
  const renderDifferentFloorNeighbors = (
    differentFloorNeighbors: Record<string, EdgeInfo>,
  ) => {
    const calculatePath = (neighborId: string) => {
      const outFloorCode = neighbors[neighborId].outFloorCode;

      // all nodes in differentFloorNeighbors should have outFloorCode
      if (outFloorCode) {
        return `${outFloorCode}?nodeId=${neighborId}`;
      } else {
        toast.error("This is not a different floor neighbor");
        return `${floorCode}?nodeId=${nodeId}`;
      }
    };

    return Object.entries(differentFloorNeighbors).map(
      ([neighborId, neighbor]) => (
        <tr key={neighborId}>
          <td className="border p-2">
            <NavLink
              className="border px-1 text-sm whitespace-nowrap hover:bg-sky-700"
              to={calculatePath(neighborId)}
            >
              {neighbor.outFloorCode}
            </NavLink>
          </td>
          <td className="border p-2">{neighbor.type}</td>

          <td className="border p-2">
            <button
              className="border px-1 text-sm whitespace-nowrap hover:bg-sky-700"
              // onClick={() => deleteEdgeAcrossFloors(neighborId)}
            >
              delete
            </button>
          </td>
        </tr>
      ),
    );
  };

  return (
    <div>
      <h1 className="mb-1">Different Floor Neighbors</h1>
      <table className="table-auto text-center">
        <tbody>
          <tr>
            {renderCell("floor")}
            {renderCell("type")}
            {renderCell("delete")}
          </tr>
          {renderDifferentFloorNeighbors(differentFloorNeighbors)}
        </tbody>
      </table>
    </div>
  );
};

export default DifferentFloorNeighborTable;
