export declare const ERROR_CODES: {
    readonly INVALID_FLOOR_LEVEL: "INVALID_FLOOR_LEVEL";
    readonly INVALID_BUILDING_CODE: "INVALID_BUILDING_CODE";
    readonly NO_DEFAULT_FLOOR: "NO_DEFAULT_FLOOR";
};

export declare type ErrorCode = keyof typeof ERROR_CODES;

export declare function getErrorMessage(code: ErrorCode): string;

export { }
