import { Knex } from "knex";
import { Column } from "knex-schema-inspector/dist/types/column";
import db from "../database/connect";
import { DiffResult, GenerateQueryResult, Operation, SchemaState, Table } from "../types/core";
import { getDiff, isDirectusTable, logDiff, missingFilter } from "../utils/common";
import { changedColumnsComparer } from "./comparers";

// This list is based on the supported types by Knex and the data that we have from knex-schema-builder
const SUPPORTED_DATA_TYPES: Array<keyof Knex.TableBuilder> = [
  "integer",
  "bigInteger",
  "text",
  "string",
  "float",
  "double",
  "decimal",
  "boolean",
  "date",
  "dateTime",
  "time",
  "timestamp",
  "binary",
  "json",
  "jsonb",
  "uuid",
];

/**
 * Generates queries to update the schema
 * @param dbState schema state in the currently running database
 * @param fileState schema state in the state file
 */
export default function createSchemaQueries(dbState: SchemaState, fileState: SchemaState): GenerateQueryResult {
  const dbStateOrdered = sortTables(dbState);
  const fileStateOrdered = sortTables(fileState);

  const createdTables = dbStateOrdered.filter(
    dbTable => !fileStateOrdered.some(stateTable => stateTable.name === dbTable.name)
  );

  const deletedTables = fileStateOrdered.filter(
    stateTable => !dbStateOrdered.some(dbTable => dbTable.name === stateTable.name)
  );

  // filter out all columns whose changes are related to the whole table being deleted/created
  const dbStateColumns = getChangedColumns(dbStateOrdered, createdTables, deletedTables);
  const fileStateColumns = getChangedColumns(fileStateOrdered, createdTables, deletedTables);

  const changedColumns = getDiff(dbStateColumns, fileStateColumns, changedColumnsComparer);

  logDiff({ tables: createdTables }, "create");
  logDiff({ tables: deletedTables }, "delete");
  logDiff({ tables: changedColumns }, "update");

  const changedQueries = generateChangedColumnsQueries(dbStateColumns, fileStateColumns, changedColumns);

  return {
    up: [...createdTables.map(createTable), ...deletedTables.map(dropTable), ...changedQueries.up],
    down: [
      ...createdTables.reverse().map(dropTable),
      ...deletedTables.reverse().map(createTable),
      ...changedQueries.down,
    ],
  };
}

/**
 * Gets all columns that are changed and are not part of create/drop of a table
 * @param tables all tables
 * @param createdTables list of tables that were created
 * @param deletedTables list of tables that were deleted
 */
const getChangedColumns = (tables: Table[], createdTables: Table[], deletedTables: Table[]) => {
  return tables
    .filter(
      table =>
        !createdTables.some(created => created.name === table.name) &&
        !deletedTables.some(deleted => deleted.name === table.name)
    )
    .flatMap(table => table.columns);
};

const createTable = (table: Table): string =>
  db()
    .schema.createTable(table.name, tableBuilder => table.columns.forEach(column => buildColumn(tableBuilder, column)))
    .toString();

const dropTable = (table: Table) => db().schema.dropTable(table.name).toString();

/**
 * Sorts all tables based on their dependency to ensure the execution order of the foreign key constraints
 * @param tables list of tables to sort
 */
const sortTables = (tables: Table[]): Table[] => {
  const tableNames = tables.map(table => table.name);
  const ordered: Table[] = [];

  while (tables.length !== ordered.length) {
    const orderedNames = ordered.map(table => table.name);

    tables.forEach(table => {
      // already processed
      if (orderedNames.includes(table.name)) {
        return;
      }

      // get all dependent tables that are not directus tables and are in the current list
      // any table not in this list should already exist and we ignore it
      const dependentTables = table.columns
        .filter(
          column =>
            column.foreign_key_table &&
            !isDirectusTable(column.foreign_key_table) &&
            tableNames.includes(column.foreign_key_table)
        )
        .map(column => column.foreign_key_table);

      // if any of the dependent tables is still not in the list of sorted, we skip the current table until all dependencies are resolved
      if (dependentTables.some(table => !orderedNames.includes(table))) {
        return;
      }

      ordered.push(table);
    });
  }

  return ordered;
};

const createColumnBuilder = (
  tableBuilder: Knex.TableBuilder,
  { name, data_type, has_auto_increment, max_length, numeric_precision, numeric_scale }: Column
): Knex.ColumnBuilder => {
  if (has_auto_increment) {
    return data_type === "integer" ? tableBuilder.increments(name) : tableBuilder.bigIncrements(name);
  }

  // both have name and length args
  if (["string", "binary"].includes(data_type)) {
    return tableBuilder[data_type](name, max_length || undefined);
  }

  // numerics have the same arguments
  if (["float", "double", "decimal"].includes(data_type)) {
    return tableBuilder[data_type](name, numeric_precision || undefined, numeric_scale || undefined);
  }

  /**
   * The rest of the types do not have specific additional arguments, so they are merged here.
   * We check first if the data_type is any of the 1st party knex-supported and use it.
   * Otherwise we default to a specific type to ensure broader compatibility with dialect-specific types.
   */
  return SUPPORTED_DATA_TYPES.map(type => type.toString()).includes(data_type)
    ? tableBuilder[data_type](name)
    : tableBuilder.specificType(name, data_type);
};

const buildColumn = (tableBuilder: Knex.TableBuilder, column: Column): Knex.ColumnBuilder => {
  const columnBuilder = createColumnBuilder(tableBuilder, column);

  // when the column is auto incremented, the default value is equal to the sequence (at least in pg)
  // which we want to ignore, since it's handled in the increments definition
  if (!column.has_auto_increment) {
    columnBuilder.defaultTo(column.default_value);
  }

  if (column.is_nullable) {
    columnBuilder.nullable();
  }

  if (column.is_unique) {
    columnBuilder.unique();
  }

  if (column.is_primary_key) {
    columnBuilder.primary();
  }

  if (column.comment) {
    columnBuilder.comment(column.comment);
  }

  if (column.foreign_key_column) {
    columnBuilder.references(column.foreign_key_column).inTable(column.foreign_key_table);
  }

  return columnBuilder;
};

/**
 * Creates the queries to be executed for create/drop/alter of columns
 * @param dbStateColumns list of columns from the database
 * @param fileStateColumns list of columns from the state file
 * @param updatedColumns diff result of the comparison
 */
const generateChangedColumnsQueries = (
  dbStateColumns: Column[],
  fileStateColumns: Column[],
  updatedColumns: DiffResult<Column>[]
): GenerateQueryResult => {
  const deletedColumns = fileStateColumns.filter(missingFilter(dbStateColumns, changedColumnsComparer));
  const createdColumns = dbStateColumns.filter(missingFilter(fileStateColumns, changedColumnsComparer));

  const deleteColumnQuery = (column: Column) =>
    db()
      .schema.alterTable(column.table, tableBuilder => {
        tableBuilder.dropColumns(column.name);
      })
      .toString();

  const buildColumnQuery = (operation: Operation) => (column: Column) => {
    return db()
      .schema.alterTable(column.table, tableBuilder => {
        const columnBuilder = buildColumn(tableBuilder, column);

        if (operation === "update") {
          columnBuilder.alter();
        }
      })
      .toString();
  };

  return {
    up: [
      ...createdColumns.map(buildColumnQuery("create")),
      ...deletedColumns.map(deleteColumnQuery),
      ...updatedColumns.map(({ newItem }) => buildColumnQuery("update")(newItem)),
    ],
    down: [
      ...createdColumns.map(deleteColumnQuery),
      ...deletedColumns.map(buildColumnQuery("create")),
      ...updatedColumns.map(({ oldItem }) => buildColumnQuery("update")(oldItem)),
    ],
  };
};
