import deepEqual from "deep-equal";
import { diff, formatters } from "jsondiffpatch";
import { DiffResult, Operation } from "../types/core";
import log from "./logger";

const DIRECTUS_TABLE_PREFIX = "directus_";

/**
 * Detects if the passed argument is an object or array or it's a primitive value
 * @param item item to evaluate
 */
export const isObject = (item: unknown): boolean => item === Object(item) || Array.isArray(item);

/**
 * Given a table name, matches if that table is a directus system table
 * @param table table name to evaluate
 */
export const isDirectusTable = (table: string): boolean => table.startsWith(DIRECTUS_TABLE_PREFIX);

/**
 * Filter function that returns all records that do not exit in a provided collection
 * @param collection2 collection to check against
 * @param comparer comparer to use to find matching records
 */
export const missingFilter =
  <TItem>(collection2: TItem[], comparer: (item: TItem) => (item: TItem) => boolean) =>
  (item: TItem): boolean =>
    !collection2.some(comparer(item));

export const capitalize = (value: string): string => value.charAt(0).toUpperCase().concat(value.slice(1));

/**
 * Given 2 collections, crates a diff for every item getting it's related one from
 * the second collection, based on the provided comparer
 * @param collection1 original collection
 * @param collection2 collection to search for related items
 * @param comparer comparer to use to find matching records
 */
export const getDiff = <TItem>(
  collection1: TItem[],
  collection2: TItem[],
  comparer: (dbItem: TItem) => (stateItem: TItem) => boolean
): DiffResult<TItem>[] => {
  return collection1.reduce((result, item) => {
    // finding the correlation by primary key in the second collection
    const relatedItem = collection2.find(comparer(item));

    if (!relatedItem || deepEqual(item, relatedItem)) {
      return result;
    }

    result.push({
      oldItem: relatedItem,
      newItem: item,
    });

    return result;
  }, [] as DiffResult<TItem>[]);
};

/**
 * Logs the differences to the console. Works for all operations
 * @param diffResults map of all collections and their diffs
 * @param operation operation being performed. Used to properly log and format the diff
 */
export const logDiff = (diffResults: Record<string, DiffResult[] | unknown[]>, operation: Operation): void => {
  Object.entries(diffResults).map(([entity, diffs]) => {
    log.message(operation, `${capitalize(entity)} to ${operation}`);

    if (diffs.length === 0) {
      log.plain("No changes detected.");
      return;
    }

    if (operation === "update") {
      (diffs as DiffResult[]).map(({ newItem, oldItem }) =>
        log.plain(formatters.console.format(diff(oldItem, newItem), oldItem))
      );
    } else {
      (diffs as unknown[]).map(item => {
        log.plain(item);
      });
    }
  });
};
