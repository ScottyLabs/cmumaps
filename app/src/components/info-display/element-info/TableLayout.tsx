import { twMerge } from "tailwind-merge";

export const RED_BUTTON_STYLE = "bg-red-500 hover:bg-red-700";

export const renderCell = (property: string, style?: string) => {
  return <td className={twMerge("border px-4 py-1", style)}>{property}</td>;
};

// table layout for RoomInfoDisplay and PoiInfoDisplay
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
