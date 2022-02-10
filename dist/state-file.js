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
exports.createStateFile = exports.readStateFile = exports.stateFileExits = void 0;
var fs_1 = require("fs");
var path_1 = __importDefault(require("path"));
var logger_1 = __importDefault(require("./utils/logger"));
/**
 * Checks if a state file already exists
 * @param filePath path to the file as requested in the CLI args
 */
var stateFileExits = function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, fs_1.promises
                .access(path_1.default.resolve(process.cwd(), filePath), fs_1.constants.F_OK)
                .then(function () { return true; })
                .catch(function () { return false; })];
    });
}); };
exports.stateFileExits = stateFileExits;
/**
 * Reads, parses and validates the state file
 * @param filePath path to the file as requested in the CLI args
 */
var readStateFile = function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
    var fileContent, e_1, state;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fileContent = "";
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fs_1.promises.readFile(path_1.default.resolve(process.cwd(), filePath), { encoding: "utf-8" })];
            case 2:
                fileContent = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                logger_1.default.message("error", "Count not read the state file from " + filePath + ". " + (e_1 instanceof Error && e_1.message));
                return [2 /*return*/, process.exit(1)];
            case 4:
                state = undefined;
                try {
                    state = JSON.parse(fileContent);
                }
                catch (e) {
                    logger_1.default.message("error", "Could not parse the state file. " + (e instanceof Error && e.message));
                    return [2 /*return*/, process.exit(1)];
                }
                if (!(state === null || state === void 0 ? void 0 : state.data) || !(state === null || state === void 0 ? void 0 : state.schema)) {
                    logger_1.default.message("error", "Error: state file seems incorrect");
                    return [2 /*return*/, process.exit(1)];
                }
                return [2 /*return*/, state];
        }
    });
}); };
exports.readStateFile = readStateFile;
/**
 * Writes a state file based on the calculated state
 * @param filePath path to the file as requested in the CLI args
 * @param schemaState state of the schema to persist
 * @param dataState state of the system tables to persist
 */
var createStateFile = function (filePath, schemaState, dataState) { return __awaiter(void 0, void 0, void 0, function () {
    var state, fileName;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logger_1.default.message("loading", "Creating a state file");
                state = {
                    schema: schemaState,
                    data: dataState,
                };
                fileName = path_1.default.resolve(process.cwd(), filePath);
                return [4 /*yield*/, fs_1.promises.writeFile(fileName, JSON.stringify(state))];
            case 1:
                _a.sent();
                logger_1.default.plain("Done - " + path_1.default.resolve(process.cwd(), filePath));
                return [2 /*return*/];
        }
    });
}); };
exports.createStateFile = createStateFile;
//# sourceMappingURL=state-file.js.map