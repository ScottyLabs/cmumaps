import { EdgeInfo } from "@cmumaps/shared";
import { v4 as uuidv4 } from "uuid";

import { NavLink } from "react-router";
import { toast } from "react-toastify";

import { useDeleteEdgeAcrossFloorsMutation } from "../../../store/api/edgeApiSlice";
import TableCell from "../shared/TableCell";

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
  const [deleteEdgeAcrossFloors] = useDeleteEdgeAcrossFloorsMutation();

  const handleDeleteAcrossFloors = (neighborId: string) => () => {
    const outFloorCode = neighbors[neighborId].outFloorCode;
    // this condition should never occur because all nodes
    // in differentFloorNeighbors should have outFloorCode
    if (!outFloorCode) {
      return;
    }

    const arg = {
      floorCode,
      outFloorCode,
      inNodeId: nodeId,
      outNodeId: neighborId,
      batchId: uuidv4(),
    };
    deleteEdgeAcrossFloors(arg);
  };

  const renderDifferentFloorNeighbors = (
    differentFloorNeighbors: Record<string, EdgeInfo>,
  ) => {
    const calculatePath = (neighborId: string) => {
      const outFloorCode = neighbors[neighborId].outFloorCode;

      // all nodes in differentFloorNeighbors should have outFloorCode
      if (outFloorCode) {
        return `/${outFloorCode}?nodeId=${neighborId}`;
      } else {
        toast.error("This is not a different floor neighbor");
        return `/${floorCode}?nodeId=${nodeId}`;
      }
    };

    return Object.entries(differentFloorNeighbors).map(
      ([neighborId, neighbor]) => (
        <tr key={neighborId}>
          <td className="border p-2">
            <NavLink
              className="border px-1 whitespace-nowrap hover:bg-sky-700"
              to={calculatePath(neighborId)}
            >
              {neighbor.outFloorCode}
            </NavLink>
          </td>
          <td className="border p-2">
            <button
              className="border px-1 whitespace-nowrap hover:bg-sky-700"
              onClick={handleDeleteAcrossFloors(neighborId)}
            >
              delete
            </button>
          </td>
        </tr>
      ),
    );
  };

  if (Object.keys(differentFloorNeighbors).length === 0) {
    return;
  }

  return (
    <div>
      <h1 className="mb-1 text-lg">Different Floor Neighbors</h1>
      <table className="table-auto text-center">
        <tbody>
          <tr>
            <TableCell text="select" />
            <TableCell text="delete" />
          </tr>
          {renderDifferentFloorNeighbors(differentFloorNeighbors)}
        </tbody>
      </table>
    </div>
  );
};

export default DifferentFloorNeighborTable;
