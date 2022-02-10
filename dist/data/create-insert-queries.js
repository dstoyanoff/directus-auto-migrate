"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInserts = void 0;
var connect_1 = __importDefault(require("../database/connect"));
var cleanup_1 = require("../utils/cleanup");
var common_1 = require("../utils/common");
var create_delete_queries_1 = require("./create-delete-queries");
var get_missing_1 = require("./get-missing");
var generateInserts = function (_a) {
    var collections = _a.collections, fields = _a.fields, permissions = _a.permissions, presets = _a.presets, relations = _a.relations;
    return [
        collections.length && connect_1.default()("directus_collections").insert(cleanup_1.escape(collections)).toString(),
        fields.length && connect_1.default()("directus_fields").insert(cleanup_1.escape(fields)).toString(),
        permissions.length && connect_1.default()("directus_permissions").insert(cleanup_1.escape(permissions)).toString(),
        presets.length && connect_1.default()("directus_presets").insert(cleanup_1.escape(presets)).toString(),
        relations.length && connect_1.default()("directus_relations").insert(cleanup_1.escape(relations)).toString(),
    ].filter(function (item) { return !!item; });
};
exports.generateInserts = generateInserts;
function createInsertQueries(dbState, fileState) {
    var missing = get_missing_1.getMissing(dbState, fileState);
    common_1.logDiff(missing, "create");
    return {
        up: exports.generateInserts(missing),
        down: create_delete_queries_1.generateDeletes(missing),
    };
}
exports.default = createInsertQueries;
//# sourceMappingURL=create-insert-queries.js.map