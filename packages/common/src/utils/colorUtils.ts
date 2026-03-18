import type { RoomType } from "../types/index.ts";

/**
 * The attributes of a room type.
 * 🐰 Easter Edition - All colors are soft pastels! 🌷
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
      return { primary: "#c8b8d8", background: "#f8f0ff", border: "#d8c8e8" };
    case "Corridor":
      return { primary: "#d0c0e0", background: "#fcf8ff", border: "#d8c8e8" };
    case "Office":
      return { primary: "#b8a8c8", background: "#f5f0fa", border: "#c8b8d8" };
    case "Auditorium":
    case "Classroom":
    case "Conference":
      return { primary: "#98b8d8", background: "#e8f4ff", border: "#a8c8e8" };
    case "Operational":
    case "Storage":
      return { primary: "#b8c8b8", background: "#f0f8f0", border: "#c8d8c8" };
    case "Laboratory":
    case "Computer Lab":
    case "Studio":
    case "Workshop":
      return { primary: "#e8a8b8", background: "#fff0f4", border: "#f0b8c8" };
    case "Vestibule":
      return { primary: "#d0c0e0", background: "#fcf8ff", border: "#d8c8e8" };
    case "Restroom":
      return { primary: "#c8a8d8", background: "#f8f0ff", border: "#d0b8e0" };
    case "Stairs":
    case "Elevator":
    case "Ramp":
      return { primary: "#a8c8d8", background: "#e8f8ff", border: "#b8d8e8" };
    case "Dining":
      return { primary: "#e8c8a8", background: "#fff8f0", border: "#f0d8b8" };
    case "Food":
      return { primary: "#e8c8a8", background: "#fff8f0", border: "#f0d8b8" };
    case "Store":
      return { primary: "#f0d8a8", background: "#fffcf0", border: "#f8e0b8" };
    case "Library":
    case "Study":
      return { primary: "#c8a8b8", background: "#f8f0f4", border: "#d8b8c8" };
    case "Sport":
      return { primary: "#a8d8b8", background: "#e8fff0", border: "#b8e8c8" };
    case "Parking":
      return { primary: "#a8b8d8", background: "#e8f0ff", border: "#b8c8e8" };
    default:
      return { primary: "#c8b8d8", background: "#f8f0ff", border: "#d8c8e8" };
  }
}
