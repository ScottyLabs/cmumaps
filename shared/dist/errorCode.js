const _ = {
  INVALID_FLOOR_LEVEL: "INVALID_FLOOR_LEVEL",
  INVALID_BUILDING_CODE: "INVALID_BUILDING_CODE",
  NO_DEFAULT_FLOOR: "NO_DEFAULT_FLOOR"
}, O = {
  INVALID_FLOOR_LEVEL: "The floor level is invalid!",
  INVALID_BUILDING_CODE: "The building code is invalid!",
  NO_DEFAULT_FLOOR: "This building has no default floor!"
};
function E(L) {
  return O[L];
}
export {
  _ as ERROR_CODES,
  E as getErrorMessage
};
