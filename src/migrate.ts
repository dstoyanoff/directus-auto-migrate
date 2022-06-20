import createMigrationFile from "./create-migration-file";
import createDeleteQueries from "./data/create-delete-queries";
import createInsertQueries from "./data/create-insert-queries";
import createUpdateQueries from "./data/create-update-queries";
import { readData } from "./data/read-data";
import createSchemaQueries from "./schema/create-schema-queries";
import readSchema from "./schema/read-schema";
import { createStateFile, readStateFile, stateFileExits } from "./state-file";
import { CLIOptions } from "./types/cli";
import log from "./utils/logger";

export default async function migrate(options: CLIOptions): Promise<void> {
  const hasStateFile = await stateFileExits(options.stateFile);

  const dbDataState = await readData();
  const dbSchemaState = await readSchema(options.allowedDirectusTables);

  if (!hasStateFile) {
    log.message(
      "unknown",
      "Seems like this is the first time running this script. We will create the state file. You should commit it to your SCM!"
    );

    return await createStateFile(options.stateFile, dbSchemaState, dbDataState);
  }

  const state = await readStateFile(options.stateFile);

  const schemaQueries = createSchemaQueries(dbSchemaState, state.schema);
  const deleteQueries = createDeleteQueries(dbDataState, state.data);
  const insertQueries = createInsertQueries(dbDataState, state.data);
  const updateQueries = createUpdateQueries(dbDataState, state.data);

  if (!deleteQueries.up.length && !insertQueries.up.length && !updateQueries.up.length && !schemaQueries.up.length) {
    log.message("success", "Your state file is up to date. Migration is not needed.");
    return;
  }

  if (options.preview) {
    log.message("success", "The script is in preview mode. No changes will be persisted to the file-system");
    return;
  }

  log.message("loading", "Generating your migration file...");

  const migrationFile = await createMigrationFile(
    options.name,
    options.migrationsDir,
    options.format,
    schemaQueries,
    deleteQueries,
    insertQueries,
    updateQueries
  );

  log.plain(`Done - ${migrationFile}`);

  await createStateFile(options.stateFile, dbSchemaState, dbDataState);
}
