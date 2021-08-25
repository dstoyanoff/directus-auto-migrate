import db from "../database/connect";
import { DiffResult, GenerateQueryResult, State } from "../types/core";
import {
  DirectusCollection,
  DirectusField,
  DirectusPermission,
  DirectusPreset,
  DirectusRelation,
} from "../types/directus";
import { escapeSingle } from "../utils/cleanup";
import { getDiff, logDiff } from "../utils/common";
import { collectionComparer, fieldComparer, permissionComparer, presetComparer, relationComparer } from "./comparers";
import {
  collectionsQueryFilter,
  fieldsQueryFilter,
  permissionsQueryFilter,
  presetsQueryFilter,
  relationsQueryFilter,
} from "./query-filters";

export const generateUpdates = (diffResults: Record<keyof State["data"], DiffResult<unknown>[]>): string[] => {
  return [
    ...diffResults.collections.map((collectionDiff: DiffResult<DirectusCollection>) => {
      const query = collectionsQueryFilter([escapeSingle(collectionDiff.oldItem)]);

      return db()("directus_collections")
        .whereIn(query.columns, query.values)
        .update(escapeSingle(collectionDiff.newItem))
        .toString();
    }),

    ...diffResults.fields.map((fieldDiff: DiffResult<DirectusField>) => {
      const query = fieldsQueryFilter([escapeSingle(fieldDiff.oldItem)]);

      return db()("directus_fields")
        .whereIn(query.columns, query.values)
        .update(escapeSingle(fieldDiff.newItem))
        .toString();
    }),

    ...diffResults.permissions.map((permissionDiff: DiffResult<DirectusPermission>) => {
      const query = permissionsQueryFilter([escapeSingle(permissionDiff.oldItem)]);

      return db()("directus_permissions")
        .whereIn(query.columns, query.values)
        .update(escapeSingle(permissionDiff.newItem))
        .toString();
    }),

    ...diffResults.presets.map((presetsDiff: DiffResult<DirectusPreset>) => {
      const query = presetsQueryFilter([escapeSingle(presetsDiff.oldItem)]);

      return db()("directus_presets")
        .whereIn(query.columns, query.values)
        .update(escapeSingle(presetsDiff.newItem))
        .toString();
    }),

    ...diffResults.relations.map((relationsDiff: DiffResult<DirectusRelation>) => {
      const query = relationsQueryFilter([escapeSingle(relationsDiff.oldItem)]);

      return db()("directus_relations")
        .whereIn(query.columns, query.values)
        .update(escapeSingle(relationsDiff.newItem))
        .toString();
    }),
  ];
};

// TODO: implement partial updates to reduce risk and query size
export default function createUpdateQueries(dbState: State["data"], fileState: State["data"]): GenerateQueryResult {
  const diff = {
    collections: getDiff(dbState.collections, fileState.collections, collectionComparer),
    fields: getDiff(dbState.fields, fileState.fields, fieldComparer),
    permissions: getDiff(dbState.permissions, fileState.permissions, permissionComparer),
    presets: getDiff(dbState.presets, fileState.presets, presetComparer),
    relations: getDiff(dbState.relations, fileState.relations, relationComparer),
  };

  logDiff(diff, "update");

  const reverseDiff = Object.entries(diff).reduce((result, [collection, collectionDiffs]) => {
    result[collection] = collectionDiffs.map((collectionDiff: DiffResult) => ({
      oldItem: collectionDiff.newItem,
      newItem: collectionDiff.oldItem,
    }));

    return result;
  }, {} as typeof diff);

  return {
    up: generateUpdates(diff),
    down: generateUpdates(reverseDiff),
  };
}
