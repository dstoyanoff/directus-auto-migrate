"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = __importDefault(require("path"));
var logger_1 = __importDefault(require("./utils/logger"));
/**
 * Formats a migration file and writes it in the file system
 * @param name name of the migration. It will append it to the file name
 * @param destinationDir the location where the migration file should be generated
 * @param format whether to generate TS or JS migration
 * @param schema list of all schema queries to be included in the migration
 * @param deletes list of all delete queries to be included in the migration
 * @param inserts list of all insert queries to be included in the migration
 * @param updates list of all update queries to be included in the migration
 */
function createMigrationFile(name, destinationDir, format, schema, deletes, inserts, updates) {
    return __awaiter(this, void 0, void 0, function () {
        var migrationFileContent, error_1, fileName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    migrationFileContent = getContent(format, schema, deletes, inserts, updates);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fs_1.promises.mkdir(path_1.default.resolve(process.cwd(), destinationDir))];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    if (error_1.code != "EEXIST") {
                        throw error_1;
                    }
                    return [3 /*break*/, 4];
                case 4: return [4 /*yield*/, getFileName(name, destinationDir, format)];
                case 5:
                    fileName = _a.sent();
                    return [4 /*yield*/, fs_1.promises.writeFile(path_1.default.resolve(process.cwd(), fileName), migrationFileContent)];
                case 6:
                    _a.sent();
                    return [2 /*return*/, fileName];
            }
        });
    });
}
exports.default = createMigrationFile;
var getFileName = function (migrationName, destinationDir, format) { return __awaiter(void 0, void 0, void 0, function () {
    var date, year, month, day, migrationTimestamp, dailyMigrationsCount, suffix, extension, nameEscaped;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                date = new Date();
                year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
                month = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(date);
                day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
                migrationTimestamp = "" + year + month + day;
                return [4 /*yield*/, fs_1.promises.readdir(path_1.default.resolve(process.cwd(), destinationDir))];
            case 1:
                dailyMigrationsCount = (_a.sent()).filter(function (file) {
                    return file.startsWith(migrationTimestamp);
                }).length;
                suffix = ("000" + (dailyMigrationsCount + 1)).substr(-3);
                extension = format === "javascript" ? "js" : "ts";
                nameEscaped = migrationName.toLowerCase().replace(/ /g, "-");
                return [2 /*return*/, destinationDir + "/" + migrationTimestamp + suffix + "-" + nameEscaped + "." + extension];
        }
    });
}); };
var queriesMerge = function (queryCollection) {
    return queryCollection
        .map(function (queries) { return queries.join(";\\\n"); })
        .filter(function (item) { return !!item; })
        .join(";\\\n \\\n ") + "\\";
};
var getContent = function (format, schema, deletes, inserts, updates) {
    var upQuery = queriesMerge([schema.up, deletes.up, inserts.up, updates.up]);
    var downQuery = queriesMerge([schema.down, deletes.down, inserts.down, updates.down]);
    logger_1.default.message("update", "Up Query", upQuery);
    logger_1.default.message("update", "Down Query", downQuery);
    if (format === "javascript") {
        return generateJSMigration(upQuery, downQuery);
    }
    return generateTSMigration(upQuery, downQuery);
};
var generateTSMigration = function (up, down) { return "/* eslint-disable no-irregular-whitespace */\nimport { Knex } from \"knex\";\n\nexport async function up(knex: Knex): Promise<void> {\n  await knex.transaction(async transaction => {\n    await transaction.raw(\"\\\n" + up + "\n     \\ \");\n  });\n}\n\nexport async function down(knex: Knex): Promise<void> {\n  await knex.transaction(async transaction => {\n    await transaction.raw(\"\\\n" + down + "\n    \\ \");\n  });\n}\n"; };
var generateJSMigration = function (up, down) { return "/* eslint-disable no-irregular-whitespace, no-undef */\nmodule.exports = {\n  async up(knex) {\n    await knex.transaction(async (transaction) => {\n      await transaction.raw(\"\\\n" + up + "\n    \\ \");\n    });\n  },\n  async down(knex) {\n    await knex.transaction(async (transaction) => {\n      await transaction.raw(\"\\\n" + down + "\n      \\ \");\n    });\n  },\n};\n"; };
//# sourceMappingURL=create-migration-file.js.map