"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.relationComparer = exports.presetComparer = exports.permissionComparer = exports.fieldComparer = exports.collectionComparer = void 0;
/**
 * Comparers are moved externally to make the code more readable and reuse them.
 * The goal is to find the unique record (primary key) that got changed in the current database version,
 * compared to the state file.
 * Since the database doesn't have strict primary/unique keys, those are defined based on common sense.
 * Please always review carefully what the generated state and queries look like
 */
var collectionComparer = function (collection1) { return function (collection2) {
    return collection2.collection === collection1.collection;
}; };
exports.collectionComparer = collectionComparer;
var fieldComparer = function (field1) { return function (field2) {
    return field2.collection === field1.collection && field2.field === field1.field;
}; };
exports.fieldComparer = fieldComparer;
var permissionComparer = function (permission1) { return function (permission2) {
    return permission2.collection === permission1.collection &&
        permission2.fields === permission1.fields &&
        permission2.action === permission1.action &&
        permission2.role === permission1.role;
}; };
exports.permissionComparer = permissionComparer;
var presetComparer = function (preset1) { return function (preset2) {
    return preset2.collection === preset1.collection && preset2.role === preset1.role;
}; };
exports.presetComparer = presetComparer;
var relationComparer = function (relation1) { return function (relation2) {
    return relation2.many_collection === relation1.many_collection &&
        relation2.many_field === relation1.many_field &&
        relation2.one_collection === relation1.one_collection &&
        relation2.one_field === relation1.one_field;
}; };
exports.relationComparer = relationComparer;
//# sourceMappingURL=comparers.js.map