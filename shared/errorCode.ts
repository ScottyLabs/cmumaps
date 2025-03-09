// Define error codes as string literals
export const ERROR_CODES = {
  INVALID_FLOOR_LEVEL: "INVALID_FLOOR_LEVEL",
  INVALID_BUILDING_CODE: "INVALID_BUILDING_CODE",
  NO_DEFAULT_FLOOR: "NO_DEFAULT_FLOOR",
} as const;

// Create type from object keys
export type ErrorCode = keyof typeof ERROR_CODES;

// Define error messages using the same keys
const ERROR_MESSAGES: Record<ErrorCode, string> = {
  INVALID_FLOOR_LEVEL: "The floor level is invalid!",
  INVALID_BUILDING_CODE: "The building code is invalid!",
  NO_DEFAULT_FLOOR: "This building has no default floor!",
};

// Function to get error message from code
export function getErrorMessage(code: ErrorCode): string {
  return ERROR_MESSAGES[code];
}
