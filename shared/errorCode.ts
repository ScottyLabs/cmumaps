export type ErrorCode =
  | 'Invalid Floor Level'
  | 'Invalid Building Code'
  | 'No Default Floor'
  | '';
export const INVALID_BUILDING_CODE = 'Invalid Building Code';
export const NO_DEFAULT_FLOOR = 'No Default Floor';
export const INVALID_FLOOR_LEVEL: ErrorCode = 'Invalid Floor Level';
