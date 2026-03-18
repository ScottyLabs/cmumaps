/** biome-ignore-all lint/style/useNamingConvention: Building code are in all caps */
/* 🐰 Easter Edition - Buildings in pastel spring colors! 🌷 */
const buildingCodeToShapeFillColor = {
  MOE: "#fff4b8" /* Pastel Yellow */,
  STE: "#b8e8c8" /* Mint Green */,
  MUD: "#d4b8e8" /* Soft Lavender */,
  MOR: "#ffd4a8" /* Peach */,
  DON: "#a8c8e8" /* Baby Blue */,

  FBA: "#ffb8c8" /* Light Pink */,

  SCO: "#e8a8c8" /* Soft Rose */,
  WEL: "#f0b8d0" /* Pastel Pink */,
  BOS: "#ffc8d8" /* Light Salmon */,
  MCG: "#e8b8c8" /* Dusty Pink */,
  HEN: "#f8d0e0" /* Pale Pink */,

  HAM: "#c8b8d8" /* Soft Purple */,
  ROS1: "#d0b8e0" /* Light Lavender */,
  ROS2: "#d8c0e8" /* Pale Purple */,
  ROS3: "#e0c8f0" /* Soft Lilac */,
  SPT: "#c8c8e8" /* Periwinkle */,
  WOO: "#d8d0f0" /* Light Periwinkle */,
  MMA: "#e8d0f8" /* Pale Lavender */,

  ROF: "#b8e0e8" /* Light Teal */,
  FCL: "#a8d8e0" /* Soft Cyan */,

  FAF: "#c8a8d8" /* Soft Violet */,
  NVL: "#d0b0e0" /* Light Violet */,
  FIF: "#d8b8e8" /* Pale Purple */,
  MC: "#e0c0f0" /* Soft Lilac */,
  HIL: "#e8c8f8" /* Light Lilac */,
  CLY: "#f0d0ff" /* Pale Lavender */,

  WWG: "#a8b8d8" /* Soft Blue */,
  RES: "#b0c0e0" /* Light Blue */,
};

export const getBuildingShapeFillColor = (buildingCode: string) =>
  buildingCodeToShapeFillColor[
    buildingCode as keyof typeof buildingCodeToShapeFillColor
  ];
