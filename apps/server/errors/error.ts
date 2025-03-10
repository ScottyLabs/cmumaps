import type { ErrorCode } from "@cmumaps/";

export class BuildingError extends Error {
  code: ErrorCode;
  constructor(code: ErrorCode) {
    super(code);
    this.code = code;
  }
}
