import db from "../database/connect";
import { GenerateQueryResult, State } from "../types/core";
import { logDiff } from "../utils/common";
import { generateInserts } from "./create-insert-queries";
import { getMissing } from "./get-missing";
import {
  collectionsQueryFilter,
  fieldsQueryFilter,
  permissionsQueryFilter,
  presetsQueryFilter,
  relationsQueryFilter,
} from "./query-filters";

export const generateDeletes = ({ collections, fields, permissions, presets, relations }: State["data"]): string[] => {
  const collectionsQuery = collectionsQueryFilter(collections);
  const fieldsQuery = fieldsQueryFilter(fields);
  const permissionsQuery = permissionsQueryFilter(permissions);
  const presetsQuery = presetsQueryFilter(presets);
  const relationsQuery = relationsQueryFilter(relations);

  return [
    collections.length &&
      db()("directus_collections").delete().whereIn(collectionsQuery.columns, collectionsQuery.values).toString(),
    fields.length && db()("directus_fields").delete().whereIn(fieldsQuery.columns, fieldsQuery.values).toString(),
    permissions.length &&
      db()("directus_permissions").delete().whereIn(permissionsQuery.columns, permissionsQuery.values).toString(),
    presets.length && db()("directus_presets").delete().whereIn(presetsQuery.columns, presetsQuery.values).toString(),
    relations.length &&
      db()("directus_relations").delete().whereIn(relationsQuery.columns, relationsQuery.values).toString(),
  ].filter(item => !!item);
};

export default function createDeleteQueries(dbState: State["data"], fileState: State["data"]): GenerateQueryResult {
  const missing = getMissing(fileState, dbState);

  logDiff(missing, "delete");

  return {
    up: generateDeletes(missing),
    down: generateInserts(missing),
  };
}
