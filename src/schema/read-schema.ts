import SchemaInspector from "knex-schema-inspector";
import db from "../database/connect";
import { SchemaState } from "../types/core";
import { isDirectusTable } from "../utils/common";
import log from "../utils/logger";

/**
 * Reads the current schema of the database
 */
export default async function readSchema(allowedDirectusTables: string): Promise<SchemaState> {
  log.message("loading", "Reading your database schema");

  const connection:any = db();
  const inspector = SchemaInspector(connection);
  const allowedTables = allowedDirectusTables.length ? allowedDirectusTables.split(',') : [];

  // Directus will take care of the system tables, so we exclude them
  const columnDefs = (await inspector.columnInfo()).filter(col =>
    !isDirectusTable(col.table) || allowedDirectusTables.includes(col.table)
  );

  const state = columnDefs.reduce((result, def) => {
    const table = result.find(table => table.name === def.table);

    if (table) {
      table.columns.push(def);
      return result;
    }

    result.push({
      name: def.table,
      columns: [def],
    });

    return result;
  }, [] as SchemaState);

  log.plain("Done");

  return state;
}
