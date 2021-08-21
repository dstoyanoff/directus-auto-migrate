import { constants as fsConstants, promises as fs } from "fs";
import path from "path";
import { DataState, SchemaState, State } from "./types/core";
import log from "./utils/logger";

/**
 * Checks if a state file already exists
 * @param filePath path to the file as requested in the CLI args
 */
export const stateFileExits = async (filePath: string): Promise<boolean> => {
  return fs
    .access(path.resolve(process.cwd(), filePath), fsConstants.F_OK)
    .then(() => true)
    .catch(() => false);
};

/**
 * Reads, parses and validates the state file
 * @param filePath path to the file as requested in the CLI args
 */
export const readStateFile = async (filePath: string): Promise<State> => {
  let fileContent = "";

  try {
    fileContent = await fs.readFile(path.resolve(process.cwd(), filePath), { encoding: "utf-8" });
  } catch (e) {
    log.message("error", `Count not read the state file from ${filePath}. ${e instanceof Error && e.message}`);

    return process.exit(1);
  }

  let state: State | undefined = undefined;

  try {
    state = JSON.parse(fileContent);
  } catch (e) {
    log.message("error", `Could not parse the state file. ${e instanceof Error && e.message}`);

    return process.exit(1);
  }

  if (!state?.data || !state?.schema) {
    log.message("error", "Error: state file seems incorrect");

    return process.exit(1);
  }

  return state;
};

/**
 * Writes a state file based on the calculated state
 * @param filePath path to the file as requested in the CLI args
 * @param schemaState state of the schema to persist
 * @param dataState state of the system tables to persist
 */
export const createStateFile = async (
  filePath: string,
  schemaState: SchemaState,
  dataState: DataState
): Promise<void> => {
  log.message("loading", "Creating a state file");

  const state: State = {
    schema: schemaState,
    data: dataState,
  };

  const fileName = path.resolve(process.cwd(), filePath);
  await fs.writeFile(fileName, JSON.stringify(state));

  log.plain(`Done - ${path.resolve(process.cwd(), filePath)}`);
};
