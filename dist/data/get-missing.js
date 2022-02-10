"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMissing = void 0;
var common_1 = require("../utils/common");
var comparers_1 = require("./comparers");
var getMissing = function (state1, state2) {
    return {
        collections: state1.collections.filter(common_1.missingFilter(state2.collections, comparers_1.collectionComparer)),
        fields: state1.fields.filter(common_1.missingFilter(state2.fields, comparers_1.fieldComparer)),
        permissions: state1.permissions.filter(common_1.missingFilter(state2.permissions, comparers_1.permissionComparer)),
        presets: state1.presets.filter(common_1.missingFilter(state2.presets, comparers_1.presetComparer)),
        relations: state1.relations.filter(common_1.missingFilter(state2.relations, comparers_1.relationComparer)),
    };
};
exports.getMissing = getMissing;
//# sourceMappingURL=get-missing.js.map