"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("./common");
var logger = console;
var emojiMap = {
    delete: "🗑",
    create: "🧱",
    error: "🔥",
    loading: "⏳",
    success: "🎉",
    unknown: "🤷‍",
    update: "✏️",
};
var logCaption = function (type, title) { return emojiMap[type] + " " + title; };
function plain(data) {
    if (common_1.isObject(data)) {
        logger.dir(data, { depth: null, colors: true });
        return;
    }
    logger.log(data);
}
function message(type, logMessage, data) {
    var formattedTitle = logCaption(type, logMessage);
    var separators = "=".repeat(10);
    logger.log("\n%s\n", separators + " " + formattedTitle + " " + separators);
    if (data) {
        logger.dir(data, { depth: null, colors: true });
    }
}
var log = {
    message: message,
    plain: plain,
};
exports.default = log;
//# sourceMappingURL=logger.js.map