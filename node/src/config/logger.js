"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var winston_1 = require("winston");
var env_util_1 = require("../utils/env.util");
var _a = winston_1.default.format, combine = _a.combine, timestamp = _a.timestamp, printf = _a.printf, align = _a.align;
var logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5
};
var logFormat = printf(function (data) {
    var namespace = data.namespace, level = data.level, message = data.message, timestamp = data.timestamp;
    return "[".concat(timestamp, "] [").concat(namespace, "] ").concat(level, ": ").concat(message);
});
var logFolder = env_util_1.default.getOrDefault('LOG_FOLDER', './logs');
var logFileName = env_util_1.default.getOrDefault('LOG_FILE_NAME', 'server.log');
var defaultLogLevel = env_util_1.default.getOrDefault('LOG_LEVEL', 'info');
var transports = [
    new winston_1.default.transports.Console()
    // TODO: Uncomment to write to file
    // new winston.transports.File({ filename: `${logFolder}/${logFileName}`, level: defaultLogLevel })
];
var logger = winston_1.default.createLogger({
    levels: logLevels,
    level: defaultLogLevel,
    format: combine(timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }), align(), logFormat),
    transports: transports
});
var Logger = function (namespace) {
    if (namespace) {
        return logger.child({ namespace: namespace });
    }
    return logger;
};
exports.Logger = Logger;
exports.default = exports.Logger;
