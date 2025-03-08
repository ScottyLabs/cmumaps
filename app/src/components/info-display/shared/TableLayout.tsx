import TableCell from "./TableCell";

// table layout for RoomInfoDisplay and PoiInfoDisplay
const TableLayout = (props: { children: React.ReactNode }) => {
  return (
    <table className="w-72 table-fixed">
      <thead>
        <tr>
          <TableCell text="Property" style="font-bold w-28" />
          <TableCell text="Value" style="font-bold" />
        </tr>
      </thead>
      <tbody>{props.children}</tbody>
    </table>
  );
};

export default TableLayout;
