import { DirectusCollection, DirectusField, DirectusPermission, DirectusPreset, DirectusRelation } from "../types/directus";
/**
 * Comparers are moved externally to make the code more readable and reuse them.
 * The goal is to find the unique record (primary key) that got changed in the current database version,
 * compared to the state file.
 * Since the database doesn't have strict primary/unique keys, those are defined based on common sense.
 * Please always review carefully what the generated state and queries look like
 */
export declare const collectionComparer: (collection1: DirectusCollection) => (collection2: DirectusCollection) => boolean;
export declare const fieldComparer: (field1: DirectusField) => (field2: DirectusField) => boolean;
export declare const permissionComparer: (permission1: DirectusPermission) => (permission2: DirectusPermission) => boolean;
export declare const presetComparer: (preset1: DirectusPreset) => (preset2: DirectusPreset) => boolean;
export declare const relationComparer: (relation1: DirectusRelation) => (relation2: DirectusRelation) => boolean;
//# sourceMappingURL=comparers.d.ts.map