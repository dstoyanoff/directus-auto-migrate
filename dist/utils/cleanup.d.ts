/**
 * Stringifies all object properties to escape them in the generated query
 * @param item item to format
 */
export declare const escapeSingle: <TItem>(item: TItem) => TItem;
/**
 * Stringifies all object properties to escape them in the generated query
 * @param items collection of items to format
 */
export declare const escape: <TItem>(items: TItem[]) => TItem[];
/**
 * We have to remove the id, since we are comparing different states of the database, thus ids are not reliable.
 * We need to compare composite primary keys instead. Typings here are not the best, since it would require
 * a great level of types verbosity
 * @param items collection of items clean up
 */
export declare const removeId: <TItem>(items: TItem[]) => TItem[];
//# sourceMappingURL=cleanup.d.ts.map