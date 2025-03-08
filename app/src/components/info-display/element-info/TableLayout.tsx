import { renderCell } from "../../../utils/displayUtils";

const TableLayout = (props: { children: React.ReactNode }) => {
  return (
    <table className="w-72 table-fixed">
      <thead>
        <tr>
          {renderCell("Property", "font-bold w-28")}
          {renderCell("Value", "font-bold")}
        </tr>
      </thead>
      <tbody>{props.children}</tbody>
    </table>
  );
};

export default TableLayout;
