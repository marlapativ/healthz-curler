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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisDataSource = void 0;
var redis_1 = require("redis");
var env_util_1 = require("../../../utils/env.util");
var validator_util_1 = require("../../../utils/validator.util");
var result_util_1 = require("../../../utils/result.util");
var logger_1 = require("../../../config/logger");
var logger = (0, logger_1.default)(import.meta.file);
var RedisDataSource = /** @class */ (function () {
    function RedisDataSource() {
        var redisUrl = env_util_1.default.getOrDefault('REDIS_URL', 'redis://localhost:6379/2');
        if (!redisUrl)
            throw new Error('REDIS_URL env variable is required');
        this._redis = (0, redis_1.createClient)({
            url: redisUrl,
            database: parseInt(env_util_1.default.getOrDefault('REDIS_DB', '2')),
            pingInterval: 2000
        });
        this._redis.on('error', function (error) {
            logger.error("Cannot connect to redis or redis error: ".concat(error));
        });
    }
    RedisDataSource.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._redis.connect();
                return [2 /*return*/, this];
            });
        });
    };
    RedisDataSource.prototype.has = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var exists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._redis.exists(key)];
                    case 1:
                        exists = _a.sent();
                        return [2 /*return*/, (0, result_util_1.Ok)(exists === 1)];
                }
            });
        });
    };
    RedisDataSource.prototype.getAll = function (keyPrefix) {
        return __awaiter(this, void 0, void 0, function () {
            var keys, valuePromises, data, results;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        keyPrefix = keyPrefix.endsWith('*') ? keyPrefix : "".concat(keyPrefix, "*");
                        return [4 /*yield*/, this._redis.keys(keyPrefix)];
                    case 1:
                        keys = _a.sent();
                        valuePromises = keys.map(function (eachKey) { return __awaiter(_this, void 0, void 0, function () {
                            var objectId, val;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        objectId = eachKey.replace(keyPrefix, '');
                                        return [4 /*yield*/, this.get(objectId)];
                                    case 1:
                                        val = _a.sent();
                                        return [2 /*return*/, val.ok ? val.value : null];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(valuePromises)];
                    case 2:
                        data = _a.sent();
                        results = data.filter(validator_util_1.default.notNull);
                        return [2 /*return*/, (0, result_util_1.Ok)(results)];
                }
            });
        });
    };
    RedisDataSource.prototype.set = function (key, data) {
        return __awaiter(this, void 0, void 0, function () {
            var retrievedData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._redis.set(key, JSON.stringify(data))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.get(key)];
                    case 2:
                        retrievedData = _a.sent();
                        return [2 /*return*/, retrievedData];
                }
            });
        });
    };
    RedisDataSource.prototype.get = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var exists, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.has(key)];
                    case 1:
                        exists = _a.sent();
                        if (!exists.ok)
                            return [2 /*return*/, new Error('Key does not exist')];
                        return [4 /*yield*/, this._redis.get(key)];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, (0, result_util_1.Ok)(JSON.parse(data))];
                }
            });
        });
    };
    RedisDataSource.prototype.delete = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var exists, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.has(key)];
                    case 1:
                        exists = _a.sent();
                        if (!exists.ok)
                            return [2 /*return*/, new Error('Key does not exist')];
                        return [4 /*yield*/, this._redis.del(key)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, (0, result_util_1.Ok)(result === 1)];
                }
            });
        });
    };
    return RedisDataSource;
}());
exports.RedisDataSource = RedisDataSource;
