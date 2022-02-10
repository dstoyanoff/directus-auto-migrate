"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDb = void 0;
var dotenv = __importStar(require("dotenv"));
var knex_1 = __importDefault(require("knex"));
var path_1 = __importDefault(require("path"));
var dbInstance;
function initDb(envFile) {
    var _a = dotenv.config({
        path: path_1.default.resolve(process.cwd(), envFile),
    }).parsed, DB_CLIENT = _a.DB_CLIENT, DB_CONNECTION_STRING = _a.DB_CONNECTION_STRING, DB_DATABASE = _a.DB_DATABASE, DB_FILENAME = _a.DB_FILENAME, DB_HOST = _a.DB_HOST, DB_PASSWORD = _a.DB_PASSWORD, DB_PORT = _a.DB_PORT, DB_USER = _a.DB_USER;
    dbInstance = knex_1.default({
        client: DB_CLIENT,
        connection: DB_CONNECTION_STRING || {
            user: DB_USER,
            database: DB_DATABASE,
            password: DB_PASSWORD,
            port: +DB_PORT,
            host: DB_HOST,
            filename: DB_FILENAME,
        },
    });
}
exports.initDb = initDb;
function db() {
    if (!dbInstance) {
        throw new Error("Db not initialized. Please call initDb");
    }
    return dbInstance;
}
exports.default = db;
//# sourceMappingURL=connect.js.map