export type DirectusCollection = {
  collection: string;
  icon: string;
  note?: string | null;
  display_template?: string | null;
  hidden?: boolean | null;
  singleton?: boolean | null;
  translations?: string | null;
  archive_field?: string | null | "status";
  archive_app_filter?: boolean | null;
  archive_value?: string | null | "archived";
  unarchive_value?: string | null | "draft";
  sort_field?: string | null | "sort";
  accountability?: string | null;
};

export type DirectusField = {
  collection: string;
  field: string;
  special?: string | null;
  interface?: string | null;
  options?: string | null;
  display?: string | null;
  display_options?: string | null;
  locked?: boolean | null;
  readonly?: boolean | null;
  hidden?: boolean | null;
  sort?: number | null;
  width?: string;
  group?: number | null;
  translations?: string | null;
  note?: string | null;
  required?: boolean;
};

export type DirectusPermission = {
  role: string | null;
  collection: string;
  action: string;
  permissions: string;
  validation: string;
  presets: string;
  fields: string | "*";
  limit: number;
};

export type DirectusPreset = {
  bookmark: string | null;
  user: string | null;
  role: string | null;
  collection: string;
  search: string | null;
  layout: string | null;
  layout_query: string | null;
  layout_options: string | null;
  refresh_interval: number | null;
};

export type DirectusRelation = {
  many_collection: string;
  many_field: string;
  one_collection: string | null;
  one_field: string | null;
  one_collection_field: string | null;
  one_allowed_collections: string | null;
  one_deselect_action: "nullify" | "delete";
  junction_field: string | null;
  sort_field: string | null;
  system?: boolean;
};

declare module "knex/types/tables" {
  interface Tables {
    directus_collections: DirectusCollection;
    directus_fields: DirectusField;
    directus_permissions: DirectusPermission;
    directus_presets: DirectusPreset;
    directus_relations: DirectusRelation;
  }
}
