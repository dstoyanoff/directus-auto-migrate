"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeId = exports.escape = exports.escapeSingle = void 0;
var common_1 = require("./common");
/**
 * Stringifies all object properties to escape them in the generated query
 * @param item item to format
 */
var escapeSingle = function (item) {
    var result = {};
    Object.keys(item).forEach(function (key) {
        result[key] = common_1.isObject(item[key]) ? JSON.stringify(item[key]) : item[key];
    });
    return result;
};
exports.escapeSingle = escapeSingle;
/**
 * Stringifies all object properties to escape them in the generated query
 * @param items collection of items to format
 */
var escape = function (items) { return items.map(exports.escapeSingle); };
exports.escape = escape;
/**
 * We have to remove the id, since we are comparing different states of the database, thus ids are not reliable.
 * We need to compare composite primary keys instead. Typings here are not the best, since it would require
 * a great level of types verbosity
 * @param items collection of items clean up
 */
var removeId = function (items) {
    return items.map(function (item) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        var _a = item, id = _a.id, rest = __rest(_a, ["id"]); // remove id
        return rest;
    });
};
exports.removeId = removeId;
//# sourceMappingURL=cleanup.js.map