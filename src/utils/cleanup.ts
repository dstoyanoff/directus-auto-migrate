import { isObject } from "./common";

/**
 * Stringifies all object properties to escape them in the generated query
 * @param items collection of items to format
 */
export const escape = <TItem>(...items: TItem[]): TItem[] =>
  items.map(item => {
    const result = {};

    Object.keys(item).forEach(key => {
      result[key] = isObject(item[key]) ? JSON.stringify(item[key]) : item[key];
    });

    return result as TItem;
  });

/**
 * We have to remove the id, since we are comparing different states of the database, thus ids are not reliable.
 * We need to compare composite primary keys instead. Typings here are not the best, since it would require
 * a great level of types verbosity
 * @param items collection of items clean up
 */
export const removeId = <TItem>(items: TItem[]): TItem[] =>
  items.map(item => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = item as Record<string, unknown>; // remove id

    return rest as unknown as TItem;
  });
