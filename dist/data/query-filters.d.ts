import { DirectusCollection, DirectusField, DirectusPermission, DirectusPreset, DirectusRelation } from "../types/directus";
declare type QueryFilter<TEntity> = {
    columns: (keyof TEntity)[];
    values: string[][];
};
export declare const collectionsQueryFilter: (collections: DirectusCollection[]) => QueryFilter<DirectusCollection>;
export declare const fieldsQueryFilter: (fields: DirectusField[]) => QueryFilter<DirectusField>;
export declare const permissionsQueryFilter: (permissions: DirectusPermission[]) => QueryFilter<DirectusPermission>;
export declare const presetsQueryFilter: (presets: DirectusPreset[]) => QueryFilter<DirectusPreset>;
export declare const relationsQueryFilter: (relations: DirectusRelation[]) => QueryFilter<DirectusRelation>;
export {};
//# sourceMappingURL=query-filters.d.ts.map