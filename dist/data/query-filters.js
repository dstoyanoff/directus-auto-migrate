"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.relationsQueryFilter = exports.presetsQueryFilter = exports.permissionsQueryFilter = exports.fieldsQueryFilter = exports.collectionsQueryFilter = void 0;
var collectionsQueryFilter = function (collections) { return ({
    columns: ["collection"],
    values: collections.map(function (collection) { return [collection.collection]; }),
}); };
exports.collectionsQueryFilter = collectionsQueryFilter;
var fieldsQueryFilter = function (fields) { return ({
    columns: ["field", "collection"],
    values: fields.map(function (field) { return [field.field, field.collection]; }),
}); };
exports.fieldsQueryFilter = fieldsQueryFilter;
var permissionsQueryFilter = function (permissions) { return ({
    columns: ["collection", "fields", "action", "role"],
    values: permissions.map(function (permission) { return [permission.collection, permission.fields, permission.action, permission.role]; }),
}); };
exports.permissionsQueryFilter = permissionsQueryFilter;
var presetsQueryFilter = function (presets) { return ({
    columns: ["collection", "role"],
    values: presets.map(function (preset) { return [preset.collection, preset.role]; }),
}); };
exports.presetsQueryFilter = presetsQueryFilter;
var relationsQueryFilter = function (relations) { return ({
    columns: ["many_collection", "many_field", "one_collection", "one_field"],
    values: relations.map(function (relation) { return [
        relation.many_collection,
        relation.many_field,
        relation.one_collection,
        relation.one_field,
    ]; }),
}); };
exports.relationsQueryFilter = relationsQueryFilter;
//# sourceMappingURL=query-filters.js.map