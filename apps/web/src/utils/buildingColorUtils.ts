/** biome-ignore-all lint/style/useNamingConvention: Building code are in all caps */
/* 🍀 St. Patrick's Day Edition - All buildings in shades of green! 🍀 */
const buildingCodeToShapeFillColor = {
  MOE: "#4caf50",   /* Material Green */
  STE: "#2e7d32",   /* Dark Green */
  MUD: "#00695c",   /* Teal Green */
  MOR: "#81c784",   /* Light Green */
  DON: "#1b5e20",   /* Dark Forest Green */

  FBA: "#66bb6a",   /* Medium Green */

  SCO: "#00c853",   /* Accent Green */
  WEL: "#00e676",   /* Bright Green */
  BOS: "#69f0ae",   /* Pale Green */
  MCG: "#00c853",   /* Accent Green */
  HEN: "#b9f6ca",   /* Very Light Green */

  HAM: "#2e7d32",   /* Dark Green */
  ROS1: "#388e3c",  /* Medium Dark Green */
  ROS2: "#43a047",  /* Medium Green */
  ROS3: "#4caf50",  /* Material Green */
  SPT: "#00c853",   /* Accent Green */
  WOO: "#66bb6a",   /* Medium Light Green */
  MMA: "#81c784",   /* Light Green */

  ROF: "#0097a7",   /* Teal (still greenish!) */
  FCL: "#26a69a",   /* Teal */

  FAF: "#00796b",   /* Teal Green */
  NVL: "#00897b",   /* Teal */
  FIF: "#009688",   /* Material Teal */
  MC: "#4db6ac",    /* Light Teal */
  HIL: "#80cbc4",   /* Very Light Teal */
  CLY: "#b2dfdb",   /* Pale Teal */

  WWG: "#1b5e20",   /* Dark Forest Green */
  RES: "#2e7d32",   /* Dark Green */
};

export const getBuildingShapeFillColor = (buildingCode: string) =>
  buildingCodeToShapeFillColor[
    buildingCode as keyof typeof buildingCodeToShapeFillColor
  ];
