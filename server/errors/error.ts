import type { ErrorCode } from '../../shared/errorCode.ts';

export class BuildingError extends Error {
  code: ErrorCode;
  constructor(code: ErrorCode) {
    super(code);
    this.code = code;
  }
}
