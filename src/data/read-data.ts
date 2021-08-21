import db from "../database/connect";
import { DataState } from "../types/core";
import { DirectusField, DirectusPermission, DirectusPreset, DirectusRelation } from "../types/directus";
import { removeId } from "../utils/cleanup";
import log from "../utils/logger";

export async function readData(): Promise<DataState> {
  log.message("loading", "Reading the current state of your Directus instance...");

  const collections = await db().select("*").from("directus_collections");
  const fields = removeId<DirectusField>(await db().select("*").from("directus_fields"));
  const permissions = removeId<DirectusPermission>(await db().select("*").from("directus_permissions"));
  const presets = removeId<DirectusPreset>(await db().select("*").from("directus_presets"));
  const relations = removeId<DirectusRelation>(await db().select("*").from("directus_relations"));

  const data: DataState = {
    collections,
    fields,
    permissions,
    presets,
    relations,
  };

  log.plain("Done");

  return data;
}
