import { Column } from "knex-schema-inspector/dist/types/column";

export const changedColumnsComparer =
  (column1: Column) =>
  (column2: Column): boolean =>
    column1.table === column2.table && column1.name === column2.name;
