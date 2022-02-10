"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDeletes = void 0;
var connect_1 = __importDefault(require("../database/connect"));
var common_1 = require("../utils/common");
var create_insert_queries_1 = require("./create-insert-queries");
var get_missing_1 = require("./get-missing");
var query_filters_1 = require("./query-filters");
var generateDeletes = function (_a) {
    var collections = _a.collections, fields = _a.fields, permissions = _a.permissions, presets = _a.presets, relations = _a.relations;
    var collectionsQuery = query_filters_1.collectionsQueryFilter(collections);
    var fieldsQuery = query_filters_1.fieldsQueryFilter(fields);
    var permissionsQuery = query_filters_1.permissionsQueryFilter(permissions);
    var presetsQuery = query_filters_1.presetsQueryFilter(presets);
    var relationsQuery = query_filters_1.relationsQueryFilter(relations);
    return [
        collections.length &&
            connect_1.default()("directus_collections").delete().whereIn(collectionsQuery.columns, collectionsQuery.values).toString(),
        fields.length && connect_1.default()("directus_fields").delete().whereIn(fieldsQuery.columns, fieldsQuery.values).toString(),
        permissions.length &&
            connect_1.default()("directus_permissions").delete().whereIn(permissionsQuery.columns, permissionsQuery.values).toString(),
        presets.length && connect_1.default()("directus_presets").delete().whereIn(presetsQuery.columns, presetsQuery.values).toString(),
        relations.length &&
            connect_1.default()("directus_relations").delete().whereIn(relationsQuery.columns, relationsQuery.values).toString(),
    ].filter(function (item) { return !!item; });
};
exports.generateDeletes = generateDeletes;
function createDeleteQueries(dbState, fileState) {
    var missing = get_missing_1.getMissing(fileState, dbState);
    common_1.logDiff(missing, "delete");
    return {
        up: exports.generateDeletes(missing),
        down: create_insert_queries_1.generateInserts(missing),
    };
}
exports.default = createDeleteQueries;
//# sourceMappingURL=create-delete-queries.js.map