import { twMerge } from "tailwind-merge";

// info-display
export const renderCell = (property: string, style?: string) => {
  return <td className={twMerge("border pr-4 pl-4", style)}>{property}</td>;
};

// side-panel and info-display
export const RED_BUTTON_STYLE = "bg-red-500 hover:bg-red-700";
