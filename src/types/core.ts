import { Column } from "knex-schema-inspector/dist/types/column";
import { DirectusCollection, DirectusField, DirectusPermission, DirectusPreset, DirectusRelation } from "./directus";

export type Table = {
  name: string;
  columns: Column[];
};

export type DataState = {
  collections: DirectusCollection[];
  fields: DirectusField[];
  permissions: DirectusPermission[];
  presets: DirectusPreset[];
  relations: DirectusRelation[];
};

export type SchemaState = Table[];

export type State = {
  data: DataState;
  schema: SchemaState;
};

export type GenerateQueryResult = {
  up: string[];
  down: string[];
};

export type Operation = "create" | "delete" | "update";

export type DiffResult<TItem = unknown> = { oldItem?: TItem; newItem?: TItem };
