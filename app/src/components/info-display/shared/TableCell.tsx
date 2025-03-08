import { twMerge } from "tailwind-merge";

export const RED_BUTTON_STYLE = "bg-red-500 hover:bg-red-700";

interface Props {
  text: string;
  style?: string;
}

const TableCell = ({ text, style }: Props) => {
  return <td className={twMerge("border px-4 py-1", style)}>{text}</td>;
};

export default TableCell;
