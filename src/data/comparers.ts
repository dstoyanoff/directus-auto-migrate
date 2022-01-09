/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  DirectusCollection,
  DirectusField,
  DirectusPermission,
  DirectusPreset,
  DirectusRelation,
} from "../types/directus";

/**
 * Comparers are moved externally to make the code more readable and reuse them.
 * The goal is to find the unique record (primary key) that got changed in the current database version,
 * compared to the state file.
 * Since the database doesn't have strict primary/unique keys, those are defined based on common sense.
 * Please always review carefully what the generated state and queries look like
 */

export const collectionComparer = (collection1: DirectusCollection) => (collection2: DirectusCollection) =>
  collection2.collection === collection1.collection;

export const fieldComparer = (field1: DirectusField) => (field2: DirectusField) =>
  field2.collection === field1.collection && field2.field === field1.field;

export const permissionComparer = (permission1: DirectusPermission) => (permission2: DirectusPermission) =>
  permission2.collection === permission1.collection &&
  permission2.fields === permission1.fields &&
  permission2.action === permission1.action &&
  permission2.role === permission1.role;

export const presetComparer = (preset1: DirectusPreset) => (preset2: DirectusPreset) =>
  preset2.collection === preset1.collection &&
  preset2.bookmark === preset1.bookmark &&
  preset2.role === preset1.role &&
  preset2.user===preset1.user;

export const relationComparer = (relation1: DirectusRelation) => (relation2: DirectusRelation) =>
  relation2.many_collection === relation1.many_collection &&
  relation2.many_field === relation1.many_field &&
  relation2.one_collection === relation1.one_collection &&
  relation2.one_field === relation1.one_field;
