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
exports.seedDatabase = exports.healthChecksSeedData = void 0;
var healthcheck_1 = require("../services/healthcheck/healthcheck");
var logger_1 = require("../config/logger");
var logger = (0, logger_1.default)(import.meta.file);
exports.healthChecksSeedData = [
    {
        id: 'b1c4a89e-4905-5e3c-b57f-dc92627d011e',
        name: 'webapp-fetch',
        description: 'Webapp Fetch Health Check',
        url: 'http://localhost:8080/healthz',
        executor: healthcheck_1.HealthCheckExecutorType.FETCH,
        interval: 10000
    },
    {
        id: 'cdb63720-9628-5ef6-bbca-2e5ce6094f3c',
        name: 'webapp-curl',
        description: 'Webapp Curl Health Check',
        url: 'http://localhost:8080/healthz',
        executor: healthcheck_1.HealthCheckExecutorType.CURL,
        interval: 10000
    }
];
var seedData = {
    healthcheck: exports.healthChecksSeedData
};
var seedDatabase = function (db) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, _a, _b, collection, data, _c, data_1, item, key, exists, result, error_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 9, , 10]);
                _i = 0, _a = Object.entries(seedData);
                _d.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 8];
                _b = _a[_i], collection = _b[0], data = _b[1];
                _c = 0, data_1 = data;
                _d.label = 2;
            case 2:
                if (!(_c < data_1.length)) return [3 /*break*/, 6];
                item = data_1[_c];
                key = "".concat(collection, ":").concat(item.id);
                return [4 /*yield*/, db.has(key)];
            case 3:
                exists = _d.sent();
                if (!exists.ok)
                    throw exists.error;
                if (!!exists.value) return [3 /*break*/, 5];
                return [4 /*yield*/, db.set(key, item)];
            case 4:
                result = _d.sent();
                if (!result.ok)
                    throw result.error;
                _d.label = 5;
            case 5:
                _c++;
                return [3 /*break*/, 2];
            case 6: return [2 /*return*/, true];
            case 7:
                _i++;
                return [3 /*break*/, 1];
            case 8: return [3 /*break*/, 10];
            case 9:
                error_1 = _d.sent();
                logger.error('Error seeding database', error_1);
                return [2 /*return*/, false];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.seedDatabase = seedDatabase;
