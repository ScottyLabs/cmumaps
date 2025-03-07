// Define error codes as an enum or string literal type
export type ErrorCode =
  | "INVALID_FLOOR_LEVEL"
  | "INVALID_BUILDING_CODE"
  | "NO_DEFAULT_FLOOR"
  | "";

// Export constants for the error codes
export const INVALID_FLOOR_LEVEL: ErrorCode = "INVALID_FLOOR_LEVEL";
export const INVALID_BUILDING_CODE: ErrorCode = "INVALID_BUILDING_CODE";
export const NO_DEFAULT_FLOOR: ErrorCode = "NO_DEFAULT_FLOOR";

// Define error messages separately from codes
const ERROR_MESSAGES = {
  INVALID_FLOOR_LEVEL: "The floor level is invalid!",
  INVALID_BUILDING_CODE: "The building code is invalid!",
  NO_DEFAULT_FLOOR: "This building has no default floor!",
} as const;

// Function to get error message from code
export function getErrorMessage(code: ErrorCode): string {
  return code ? ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES] : "";
}
