import { GeoRoom, RoomType } from "@cmumaps/common";
import restroomIcon from "@icons/quick_search/restroom.svg";
import corridorIcon from "@icons/search_results/corridor.svg";
import diningIcon from "@icons/search_results/dining.svg";
import elevatorIcon from "@icons/search_results/elevator.svg";
import foodIcon from "@icons/search_results/food.svg";
import pinIcon from "@icons/search_results/pin.svg";
import stairsIcon from "@icons/search_results/stairs.svg";
import studyIcon from "@icons/search_results/study.svg";

import { Document } from "@/types/searchTypes";

const icons: Partial<Record<RoomType, string>> = {
  Elevator: elevatorIcon,
  Corridor: corridorIcon,
  Dining: diningIcon,
  Food: foodIcon,
  Stairs: stairsIcon,
  Library: studyIcon,
  Restroom: restroomIcon,
  Classroom: studyIcon,
  Parking: pinIcon,
  Studio: pinIcon,
  Vestibule: pinIcon,
  Auditorium: pinIcon,
  Sport: pinIcon,
  Workshop: pinIcon,
  Store: pinIcon,
};

export function hasIcon(room: GeoRoom | Document) {
  return room.type in icons;
}

export function getIcon(room: GeoRoom | Document) {
  if (room.type == "Building") {
    return null;
  }

  return icons[room.type];
}
