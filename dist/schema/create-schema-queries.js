"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var connect_1 = __importDefault(require("../database/connect"));
var common_1 = require("../utils/common");
var comparers_1 = require("./comparers");
// This list is based on the supported types by Knex and the data that we have from knex-schema-builder
var SUPPORTED_DATA_TYPES = [
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
function createSchemaQueries(dbState, fileState) {
    var dbStateOrdered = sortTables(dbState);
    var fileStateOrdered = sortTables(fileState);
    var createdTables = dbStateOrdered.filter(function (dbTable) { return !fileStateOrdered.some(function (stateTable) { return stateTable.name === dbTable.name; }); });
    var deletedTables = fileStateOrdered.filter(function (stateTable) { return !dbStateOrdered.some(function (dbTable) { return dbTable.name === stateTable.name; }); });
    // filter out all columns whose changes are related to the whole table being deleted/created
    var dbStateColumns = getChangedColumns(dbStateOrdered, createdTables, deletedTables);
    var fileStateColumns = getChangedColumns(fileStateOrdered, createdTables, deletedTables);
    var changedColumns = common_1.getDiff(dbStateColumns, fileStateColumns, comparers_1.changedColumnsComparer);
    common_1.logDiff({ tables: createdTables }, "create");
    common_1.logDiff({ tables: deletedTables }, "delete");
    common_1.logDiff({ tables: changedColumns }, "update");
    var changedQueries = generateChangedColumnsQueries(dbStateColumns, fileStateColumns, changedColumns);
    return {
        up: __spreadArray(__spreadArray(__spreadArray([], createdTables.map(createTable)), deletedTables.map(dropTable)), changedQueries.up),
        down: __spreadArray(__spreadArray(__spreadArray([], createdTables.reverse().map(dropTable)), deletedTables.reverse().map(createTable)), changedQueries.down),
    };
}
exports.default = createSchemaQueries;
/**
 * Gets all columns that are changed and are not part of create/drop of a table
 * @param tables all tables
 * @param createdTables list of tables that were created
 * @param deletedTables list of tables that were deleted
 */
var getChangedColumns = function (tables, createdTables, deletedTables) {
    return tables
        .filter(function (table) {
        return !createdTables.some(function (created) { return created.name === table.name; }) &&
            !deletedTables.some(function (deleted) { return deleted.name === table.name; });
    })
        .flatMap(function (table) { return table.columns; });
};
var createTable = function (table) {
    return connect_1.default()
        .schema.createTable(table.name, function (tableBuilder) { return table.columns.forEach(function (column) { return buildColumn(tableBuilder, column); }); })
        .toString();
};
var dropTable = function (table) { return connect_1.default().schema.dropTable(table.name).toString(); };
/**
 * Sorts all tables based on their dependency to ensure the execution order of the foreign key constraints
 * @param tables list of tables to sort
 */
var sortTables = function (tables) {
    var tableNames = tables.map(function (table) { return table.name; });
    var ordered = [];
    var _loop_1 = function () {
        var orderedNames = ordered.map(function (table) { return table.name; });
        tables.forEach(function (table) {
            // already processed
            if (orderedNames.includes(table.name)) {
                return;
            }
            // get all dependent tables that are not directus tables and are in the current list
            // any table not in this list should already exist and we ignore it
            var dependentTables = table.columns
                .filter(function (column) {
                return column.foreign_key_table &&
                    column.foreign_key_table !== table.name &&
                    !common_1.isDirectusTable(column.foreign_key_table) &&
                    tableNames.includes(column.foreign_key_table);
            })
                .map(function (column) { return column.foreign_key_table; });
            // if any of the dependent tables is still not in the list of sorted, we skip the current table until all dependencies are resolved
            if (dependentTables.some(function (table) { return !orderedNames.includes(table); })) {
                return;
            }
            ordered.push(table);
        });
    };
    while (tables.length !== ordered.length) {
        _loop_1();
    }
    return ordered;
};
var createColumnBuilder = function (tableBuilder, _a) {
    var name = _a.name, data_type = _a.data_type, has_auto_increment = _a.has_auto_increment, max_length = _a.max_length, numeric_precision = _a.numeric_precision, numeric_scale = _a.numeric_scale;
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
    return SUPPORTED_DATA_TYPES.map(function (type) { return type.toString(); }).includes(data_type)
        ? tableBuilder[data_type](name)
        : tableBuilder.specificType(name, data_type);
};
var buildColumn = function (tableBuilder, column) {
    var columnBuilder = createColumnBuilder(tableBuilder, column);
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
var generateChangedColumnsQueries = function (dbStateColumns, fileStateColumns, updatedColumns) {
    var deletedColumns = fileStateColumns.filter(common_1.missingFilter(dbStateColumns, comparers_1.changedColumnsComparer));
    var createdColumns = dbStateColumns.filter(common_1.missingFilter(fileStateColumns, comparers_1.changedColumnsComparer));
    var deleteColumnQuery = function (column) {
        return connect_1.default()
            .schema.alterTable(column.table, function (tableBuilder) {
            tableBuilder.dropColumns(column.name);
        })
            .toString();
    };
    var buildColumnQuery = function (operation) { return function (column) {
        return connect_1.default()
            .schema.alterTable(column.table, function (tableBuilder) {
            var columnBuilder = buildColumn(tableBuilder, column);
            if (operation === "update") {
                columnBuilder.alter();
            }
        })
            .toString();
    }; };
    return {
        up: __spreadArray(__spreadArray(__spreadArray([], createdColumns.map(buildColumnQuery("create"))), deletedColumns.map(deleteColumnQuery)), updatedColumns.map(function (_a) {
            var newItem = _a.newItem;
            return buildColumnQuery("update")(newItem);
        })),
        down: __spreadArray(__spreadArray(__spreadArray([], createdColumns.map(deleteColumnQuery)), deletedColumns.map(buildColumnQuery("create"))), updatedColumns.map(function (_a) {
            var oldItem = _a.oldItem;
            return buildColumnQuery("update")(oldItem);
        })),
    };
};
//# sourceMappingURL=create-schema-queries.js.map