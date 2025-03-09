import type { ErrorCode } from "@cmumaps/shared/errorCode";

export class BuildingError extends Error {
  code: ErrorCode;
  constructor(code: ErrorCode) {
    super(code);
    this.code = code;
  }
}
