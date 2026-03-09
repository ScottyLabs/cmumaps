import type { RoomType } from "../types/index.ts";

/**
 * The attributes of a room type.
 * 🍀 St. Patrick's Day Edition - All colors are shades of green! 🍀
 */
interface RoomTypeDetails {
  /**
   * A CSS color used for the marker of the room
   */
  primary: string;

  /**
   * A CSS color used for the background of the room's shape
   */
  background: string;

  /**
   * A CSS color used for the border of the room's shape
   */
  border: string;
}

/**
 * Returns the attributes of a room type
 * @param type The type of the room
 * @returns See RoomTypeDetails
 */
export function getRoomTypeDetails(type: RoomType): RoomTypeDetails {
  switch (type) {
    case "Default":
      return { primary: "#2e7d32", background: "#e8f5e9", border: "#81c784" };
    case "Corridor":
      return { primary: "#66bb6a", background: "#c8e6c9", border: "#4caf50" };
    case "Office":
      return { primary: "#43a047", background: "#dcedc8", border: "#66bb6a" };
    case "Auditorium":
    case "Classroom":
    case "Conference":
      return { primary: "#1b5e20", background: "#c8e6c9", border: "#388e3c" };
    case "Operational":
    case "Storage":
      return { primary: "#558b2f", background: "#dcedc8", border: "#689f38" };
    case "Laboratory":
    case "Computer Lab":
    case "Studio":
    case "Workshop":
      return { primary: "#00c853", background: "#b9f6ca", border: "#00e676" };
    case "Vestibule":
      return { primary: "#81c784", background: "#f1f8e9", border: "#a5d6a7" };
    case "Restroom":
      return { primary: "#0097a7", background: "#e0f7fa", border: "#00acc1" };
    case "Stairs":
    case "Elevator":
    case "Ramp":
      return { primary: "#00796b", background: "#b2dfdb", border: "#009688" };
    case "Dining":
      return { primary: "#33691e", background: "#dcedc8", border: "#558b2f" };
    case "Food":
      return { primary: "#2e7d32", background: "#c8e6c9", border: "#43a047" };
    case "Store":
      return { primary: "#1b5e20", background: "#a5d6a7", border: "#2e7d32" };
    case "Library":
    case "Study":
      return { primary: "#388e3c", background: "#c8e6c9", border: "#4caf50" };
    case "Sport":
      return { primary: "#00e676", background: "#b9f6ca", border: "#00c853" };
    case "Parking":
      return { primary: "#26a69a", background: "#e0f2f1", border: "#26a69a" };
    default:
      return { primary: "#2e7d32", background: "#e8f5e9", border: "#81c784" };
  }
}
