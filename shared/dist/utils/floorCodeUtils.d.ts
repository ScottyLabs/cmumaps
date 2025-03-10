/**
 * Extract the building code associated with the floor code.
 *
 * @param floorCode (e.g: GHC-4)
 * @returns The building code associated with the floor code (e.g: GHC)
 */
export declare const extractBuildingCode: (floorCode: string) => string;
/**
 * Extract the floor level associated with the floor code.
 *
 * @param floorCode (e.g: GHC-4)
 * @returns The floor level associated with the floor code (e.g: 4)
 */
export declare const extractFloorLevel: (floorCode: string) => string;
