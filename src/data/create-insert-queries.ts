import db from "../database/connect";
import { GenerateQueryResult, State } from "../types/core";
import { escape } from "../utils/cleanup";
import { logDiff } from "../utils/common";
import { generateDeletes } from "./create-delete-queries";
import { getMissing } from "./get-missing";

export const generateInserts = ({ collections, fields, permissions, presets, relations }: State["data"]): string[] =>
  [
    collections.length && db()("directus_collections").insert(escape(collections)).toString(),
    fields.length && db()("directus_fields").insert(escape(fields)).toString(),
    permissions.length && db()("directus_permissions").insert(escape(permissions)).toString(),
    presets.length && db()("directus_presets").insert(escape(presets)).toString(),
    relations.length && db()("directus_relations").insert(escape(relations)).toString(),
  ].filter(item => !!item);

export default function createInsertQueries(dbState: State["data"], fileState: State["data"]): GenerateQueryResult {
  const missing = getMissing(dbState, fileState);

  logDiff(missing, "create");

  return {
    up: generateInserts(missing),
    down: generateDeletes(missing),
  };
}
