import type { ErrorCode } from "@cmumaps/common/src/errorCode";

export class BuildingError extends Error {
  public code: ErrorCode;
  public constructor(code: ErrorCode) {
    super(code);
    this.code = code;
  }
}
