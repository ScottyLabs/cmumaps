const o = [
  "Ramp",
  "Stairs",
  "Elevator",
  ""
  // not assigned
], r = [
  "Default",
  "Corridor",
  "Auditorium",
  "Office",
  "Classroom",
  "Operational",
  // Used for storage or maintenance, not publicly accessible
  "Conference",
  "Study",
  "Laboratory",
  "Computer Lab",
  "Studio",
  "Workshop",
  "Vestibule",
  "Storage",
  "Restroom",
  "Stairs",
  "Elevator",
  "Ramp",
  "Dining",
  "Food",
  "Store",
  "Library",
  "Sport",
  "Parking",
  "Inaccessible",
  ""
  // not assigned
], e = ["Corridor", "Ramp", "Library"], a = [
  "Vending Machine",
  "Water Fountain",
  "Printer",
  ""
];
export {
  a as PoiTypes,
  r as RoomTypes,
  o as ValidCrossFloorEdgeTypes,
  e as WalkwayTypeList
};
