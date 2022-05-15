"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changedColumnsComparer = void 0;
var changedColumnsComparer = function (column1) {
    return function (column2) {
        return column1.table === column2.table && column1.name === column2.name;
    };
};
exports.changedColumnsComparer = changedColumnsComparer;
//# sourceMappingURL=comparers.js.map