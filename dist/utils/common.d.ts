import { DiffResult, Operation } from "../types/core";
/**
 * Detects if the passed argument is an object or array or it's a primitive value
 * @param item item to evaluate
 */
export declare const isObject: (item: unknown) => boolean;
/**
 * Given a table name, matches if that table is a directus system table
 * @param table table name to evaluate
 */
export declare const isDirectusTable: (table: string) => boolean;
/**
 * Filter function that returns all records that do not exit in a provided collection
 * @param collection2 collection to check against
 * @param comparer comparer to use to find matching records
 */
export declare const missingFilter: <TItem>(collection2: TItem[], comparer: (item: TItem) => (item: TItem) => boolean) => (item: TItem) => boolean;
export declare const capitalize: (value: string) => string;
/**
 * Given 2 collections, crates a diff for every item getting it's related one from
 * the second collection, based on the provided comparer
 * @param collection1 original collection
 * @param collection2 collection to search for related items
 * @param comparer comparer to use to find matching records
 */
export declare const getDiff: <TItem>(collection1: TItem[], collection2: TItem[], comparer: (dbItem: TItem) => (stateItem: TItem) => boolean) => DiffResult<TItem>[];
/**
 * Logs the differences to the console. Works for all operations
 * @param diffResults map of all collections and their diffs
 * @param operation operation being performed. Used to properly log and format the diff
 */
export declare const logDiff: (diffResults: Record<string, DiffResult[] | unknown[]>, operation: Operation) => void;
//# sourceMappingURL=common.d.ts.map