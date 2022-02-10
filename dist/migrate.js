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
var create_migration_file_1 = __importDefault(require("./create-migration-file"));
var create_delete_queries_1 = __importDefault(require("./data/create-delete-queries"));
var create_insert_queries_1 = __importDefault(require("./data/create-insert-queries"));
var create_update_queries_1 = __importDefault(require("./data/create-update-queries"));
var read_data_1 = require("./data/read-data");
var create_schema_queries_1 = __importDefault(require("./schema/create-schema-queries"));
var read_schema_1 = __importDefault(require("./schema/read-schema"));
var state_file_1 = require("./state-file");
var logger_1 = __importDefault(require("./utils/logger"));
function migrate(options) {
    return __awaiter(this, void 0, void 0, function () {
        var hasStateFile, dbDataState, dbSchemaState, state, schemaQueries, deleteQueries, insertQueries, updateQueries, migrationFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, state_file_1.stateFileExits(options.stateFile)];
                case 1:
                    hasStateFile = _a.sent();
                    return [4 /*yield*/, read_data_1.readData()];
                case 2:
                    dbDataState = _a.sent();
                    return [4 /*yield*/, read_schema_1.default()];
                case 3:
                    dbSchemaState = _a.sent();
                    if (!!hasStateFile) return [3 /*break*/, 5];
                    logger_1.default.message("unknown", "Seems like this is the first time running this script. We will create the state file. You should commit it to your SCM!");
                    return [4 /*yield*/, state_file_1.createStateFile(options.stateFile, dbSchemaState, dbDataState)];
                case 4: return [2 /*return*/, _a.sent()];
                case 5: return [4 /*yield*/, state_file_1.readStateFile(options.stateFile)];
                case 6:
                    state = _a.sent();
                    schemaQueries = create_schema_queries_1.default(dbSchemaState, state.schema);
                    deleteQueries = create_delete_queries_1.default(dbDataState, state.data);
                    insertQueries = create_insert_queries_1.default(dbDataState, state.data);
                    updateQueries = create_update_queries_1.default(dbDataState, state.data);
                    if (!deleteQueries.up.length && !insertQueries.up.length && !updateQueries.up.length && !schemaQueries.up.length) {
                        logger_1.default.message("success", "Your state file is up to date. Migration is not needed.");
                        return [2 /*return*/];
                    }
                    if (options.preview) {
                        logger_1.default.message("success", "The script is in preview mode. No changes will be persisted to the file-system");
                        return [2 /*return*/];
                    }
                    logger_1.default.message("loading", "Generating your migration file...");
                    return [4 /*yield*/, create_migration_file_1.default(options.name, options.migrationsDir, options.format, schemaQueries, deleteQueries, insertQueries, updateQueries)];
                case 7:
                    migrationFile = _a.sent();
                    logger_1.default.plain("Done - " + migrationFile);
                    return [4 /*yield*/, state_file_1.createStateFile(options.stateFile, dbSchemaState, dbDataState)];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = migrate;
//# sourceMappingURL=migrate.js.map