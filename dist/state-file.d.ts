import { DataState, SchemaState, State } from "./types/core";
/**
 * Checks if a state file already exists
 * @param filePath path to the file as requested in the CLI args
 */
export declare const stateFileExits: (filePath: string) => Promise<boolean>;
/**
 * Reads, parses and validates the state file
 * @param filePath path to the file as requested in the CLI args
 */
export declare const readStateFile: (filePath: string) => Promise<State>;
/**
 * Writes a state file based on the calculated state
 * @param filePath path to the file as requested in the CLI args
 * @param schemaState state of the schema to persist
 * @param dataState state of the system tables to persist
 */
export declare const createStateFile: (filePath: string, schemaState: SchemaState, dataState: DataState) => Promise<void>;
//# sourceMappingURL=state-file.d.ts.map