"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logDiff = exports.getDiff = exports.capitalize = exports.missingFilter = exports.isDirectusTable = exports.isObject = void 0;
var deep_equal_1 = __importDefault(require("deep-equal"));
var jsondiffpatch_1 = require("jsondiffpatch");
var logger_1 = __importDefault(require("./logger"));
var DIRECTUS_TABLE_PREFIX = "directus_";
/**
 * Detects if the passed argument is an object or array or it's a primitive value
 * @param item item to evaluate
 */
var isObject = function (item) { return item === Object(item) || Array.isArray(item); };
exports.isObject = isObject;
/**
 * Given a table name, matches if that table is a directus system table
 * @param table table name to evaluate
 */
var isDirectusTable = function (table) { return table.startsWith(DIRECTUS_TABLE_PREFIX); };
exports.isDirectusTable = isDirectusTable;
/**
 * Filter function that returns all records that do not exit in a provided collection
 * @param collection2 collection to check against
 * @param comparer comparer to use to find matching records
 */
var missingFilter = function (collection2, comparer) {
    return function (item) {
        return !collection2.some(comparer(item));
    };
};
exports.missingFilter = missingFilter;
var capitalize = function (value) { return value.charAt(0).toUpperCase().concat(value.slice(1)); };
exports.capitalize = capitalize;
/**
 * Given 2 collections, crates a diff for every item getting it's related one from
 * the second collection, based on the provided comparer
 * @param collection1 original collection
 * @param collection2 collection to search for related items
 * @param comparer comparer to use to find matching records
 */
var getDiff = function (collection1, collection2, comparer) {
    return collection1.reduce(function (result, item) {
        // finding the correlation by primary key in the second collection
        var relatedItem = collection2.find(comparer(item));
        if (!relatedItem || deep_equal_1.default(item, relatedItem)) {
            return result;
        }
        result.push({
            oldItem: relatedItem,
            newItem: item,
        });
        return result;
    }, []);
};
exports.getDiff = getDiff;
/**
 * Logs the differences to the console. Works for all operations
 * @param diffResults map of all collections and their diffs
 * @param operation operation being performed. Used to properly log and format the diff
 */
var logDiff = function (diffResults, operation) {
    Object.entries(diffResults).map(function (_a) {
        var entity = _a[0], diffs = _a[1];
        logger_1.default.message(operation, exports.capitalize(entity) + " to " + operation);
        if (diffs.length === 0) {
            logger_1.default.plain("No changes detected.");
            return;
        }
        if (operation === "update") {
            diffs.map(function (_a) {
                var newItem = _a.newItem, oldItem = _a.oldItem;
                return logger_1.default.plain(jsondiffpatch_1.formatters.console.format(jsondiffpatch_1.diff(oldItem, newItem), oldItem));
            });
        }
        else {
            diffs.map(function (item) {
                logger_1.default.plain(item);
            });
        }
    });
};
exports.logDiff = logDiff;
//# sourceMappingURL=common.js.map