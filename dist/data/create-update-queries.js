"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUpdates = void 0;
var connect_1 = __importDefault(require("../database/connect"));
var cleanup_1 = require("../utils/cleanup");
var common_1 = require("../utils/common");
var comparers_1 = require("./comparers");
var query_filters_1 = require("./query-filters");
var generateUpdates = function (diffResults) {
    return __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], diffResults.collections.map(function (collectionDiff) {
        var query = query_filters_1.collectionsQueryFilter([cleanup_1.escapeSingle(collectionDiff.oldItem)]);
        return connect_1.default()("directus_collections")
            .whereIn(query.columns, query.values)
            .update(cleanup_1.escapeSingle(collectionDiff.newItem))
            .toString();
    })), diffResults.fields.map(function (fieldDiff) {
        var query = query_filters_1.fieldsQueryFilter([cleanup_1.escapeSingle(fieldDiff.oldItem)]);
        return connect_1.default()("directus_fields")
            .whereIn(query.columns, query.values)
            .update(cleanup_1.escapeSingle(fieldDiff.newItem))
            .toString();
    })), diffResults.permissions.map(function (permissionDiff) {
        var query = query_filters_1.permissionsQueryFilter([cleanup_1.escapeSingle(permissionDiff.oldItem)]);
        return connect_1.default()("directus_permissions")
            .whereIn(query.columns, query.values)
            .update(cleanup_1.escapeSingle(permissionDiff.newItem))
            .toString();
    })), diffResults.presets.map(function (presetsDiff) {
        var query = query_filters_1.presetsQueryFilter([cleanup_1.escapeSingle(presetsDiff.oldItem)]);
        return connect_1.default()("directus_presets")
            .whereIn(query.columns, query.values)
            .update(cleanup_1.escapeSingle(presetsDiff.newItem))
            .toString();
    })), diffResults.relations.map(function (relationsDiff) {
        var query = query_filters_1.relationsQueryFilter([cleanup_1.escapeSingle(relationsDiff.oldItem)]);
        return connect_1.default()("directus_relations")
            .whereIn(query.columns, query.values)
            .update(cleanup_1.escapeSingle(relationsDiff.newItem))
            .toString();
    }));
};
exports.generateUpdates = generateUpdates;
// TODO: implement partial updates to reduce risk and query size
function createUpdateQueries(dbState, fileState) {
    var diff = {
        collections: common_1.getDiff(dbState.collections, fileState.collections, comparers_1.collectionComparer),
        fields: common_1.getDiff(dbState.fields, fileState.fields, comparers_1.fieldComparer),
        permissions: common_1.getDiff(dbState.permissions, fileState.permissions, comparers_1.permissionComparer),
        presets: common_1.getDiff(dbState.presets, fileState.presets, comparers_1.presetComparer),
        relations: common_1.getDiff(dbState.relations, fileState.relations, comparers_1.relationComparer),
    };
    common_1.logDiff(diff, "update");
    var reverseDiff = Object.entries(diff).reduce(function (result, _a) {
        var collection = _a[0], collectionDiffs = _a[1];
        result[collection] = collectionDiffs.map(function (collectionDiff) { return ({
            oldItem: collectionDiff.newItem,
            newItem: collectionDiff.oldItem,
        }); });
        return result;
    }, {});
    return {
        up: exports.generateUpdates(diff),
        down: exports.generateUpdates(reverseDiff),
    };
}
exports.default = createUpdateQueries;
//# sourceMappingURL=create-update-queries.js.map