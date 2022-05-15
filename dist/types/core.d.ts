import { Column } from "knex-schema-inspector/dist/types/column";
import { DirectusCollection, DirectusField, DirectusPermission, DirectusPreset, DirectusRelation } from "./directus";
export declare type Table = {
    name: string;
    columns: Column[];
};
export declare type DataState = {
    collections: DirectusCollection[];
    fields: DirectusField[];
    permissions: DirectusPermission[];
    presets: DirectusPreset[];
    relations: DirectusRelation[];
};
export declare type SchemaState = Table[];
export declare type State = {
    data: DataState;
    schema: SchemaState;
};
export declare type GenerateQueryResult = {
    up: string[];
    down: string[];
};
export declare type Operation = "create" | "delete" | "update";
export declare type DiffResult<TItem = unknown> = {
    oldItem?: TItem;
    newItem?: TItem;
};
//# sourceMappingURL=core.d.ts.map