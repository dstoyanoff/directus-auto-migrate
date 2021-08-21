import {
  DirectusCollection,
  DirectusField,
  DirectusPermission,
  DirectusPreset,
  DirectusRelation,
} from "../types/directus";

type QueryFilter<TEntity> = {
  columns: (keyof TEntity)[];
  values: string[][]; // Proper type would be nice here, but challenging 😬
};

export const collectionsQueryFilter = (collections: DirectusCollection[]): QueryFilter<DirectusCollection> => ({
  columns: ["collection"],
  values: collections.map(collection => [collection.collection]),
});

export const fieldsQueryFilter = (fields: DirectusField[]): QueryFilter<DirectusField> => ({
  columns: ["field", "collection"],
  values: fields.map(field => [field.field, field.collection]),
});

export const permissionsQueryFilter = (permissions: DirectusPermission[]): QueryFilter<DirectusPermission> => ({
  columns: ["collection", "fields", "action", "role"],
  values: permissions.map(permission => [permission.collection, permission.fields, permission.action, permission.role]),
});

export const presetsQueryFilter = (presets: DirectusPreset[]): QueryFilter<DirectusPreset> => ({
  columns: ["collection", "role"],
  values: presets.map(preset => [preset.collection, preset.role]),
});

export const relationsQueryFilter = (relations: DirectusRelation[]): QueryFilter<DirectusRelation> => ({
  columns: ["many_collection", "many_field", "one_collection", "one_field"],
  values: relations.map(relation => [
    relation.many_collection,
    relation.many_field,
    relation.one_collection,
    relation.one_field,
  ]),
});
