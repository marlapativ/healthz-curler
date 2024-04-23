"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getOrDefault = function (key, defaultValue) {
    if (process.env[key]) {
        return process.env[key];
    }
    return defaultValue;
};
var env = {
    getOrDefault: getOrDefault
};
exports.default = env;
