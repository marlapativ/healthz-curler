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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfluxDBDataSource = void 0;
var influxdb_client_1 = require("@influxdata/influxdb-client");
var env_util_1 = require("../../../utils/env.util");
var InfluxDBDataSource = /** @class */ (function () {
    function InfluxDBDataSource() {
        var token = env_util_1.default.getOrDefault('INFLUX_TOKEN', '');
        this.bucket = env_util_1.default.getOrDefault('INFLUX_BUCKET', 'healthz-curler');
        var org = env_util_1.default.getOrDefault('INFLUX_ORG', 'healthz-curler');
        if (!token)
            throw new Error('InfluxDB token is required');
        if (!this.bucket || !org)
            throw new Error('InfluxDB bucket and organization are required');
        this._influxDb = new influxdb_client_1.InfluxDB({
            url: env_util_1.default.getOrDefault('INFLUX_URL', 'http://localhost:8086'),
            token: token
        });
        this.writeApi = this._influxDb.getWriteApi(org, this.bucket, undefined, { flushInterval: 5000 });
        this.writeApi.useDefaultTags({ implementation: 'bun', language: 'js' });
        this.queryApi = this._influxDb.getQueryApi(org);
    }
    InfluxDBDataSource.prototype.writePoint = function (point) {
        return __awaiter(this, void 0, void 0, function () {
            var timestamp, pointToWrite, _i, _a, _b, key, value;
            return __generator(this, function (_c) {
                timestamp = point.timestamp ? point.timestamp : new Date();
                pointToWrite = new influxdb_client_1.Point(point.name).timestamp(timestamp).tag('id', point.id).tag('type', point.type);
                for (_i = 0, _a = Object.entries(point.properties); _i < _a.length; _i++) {
                    _b = _a[_i], key = _b[0], value = _b[1];
                    if (typeof value === 'number')
                        pointToWrite = pointToWrite.floatField(key, value);
                    else if (typeof value === 'boolean')
                        pointToWrite = pointToWrite.booleanField(key, value);
                    else
                        pointToWrite = pointToWrite.stringField(key, value);
                }
                this.writeApi.writePoint(pointToWrite);
                return [2 /*return*/];
            });
        });
    };
    InfluxDBDataSource.prototype.queryData = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var page, pageSize, query, result, _a, _b, _c, values, tableMeta, record, e_1_1;
            var _d, e_1, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        page = request.page ? request.page : 1;
                        pageSize = request.pageSize ? request.pageSize : 100;
                        query = "from(bucket: \"".concat(this.bucket, "\")\n      |> range(start: ").concat(request.startTime.getTime(), ", stop: ").concat(request.endTime.getTime(), ")\n      |> filter(fn: (r) => r[\"implementation\"] == \"bun\")\n      |> filter(fn: (r) => r[\"language\"] == \"js\")\n      |> filter(fn: (r) => r[\"_measurement\"] == \"").concat(request.name, "\")\n      |> filter(fn: (r) => r[\"id\"] == \"").concat(request.id, "\")\n      |> filter(fn: (r) => r[\"type\"] == \"").concat(request.type, "\")\n      |> sort(columns: [\"_time\"], desc: true)\n      |> limit(n: ").concat(pageSize, ", offset: ").concat((page - 1) * pageSize, ")");
                        result = [];
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 6, 7, 12]);
                        _a = true, _b = __asyncValues(this.queryApi.iterateRows(query));
                        _g.label = 2;
                    case 2: return [4 /*yield*/, _b.next()];
                    case 3:
                        if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 5];
                        _f = _c.value;
                        _a = false;
                        values = _f.values, tableMeta = _f.tableMeta;
                        record = tableMeta.toObject(values);
                        result.push(record);
                        _g.label = 4;
                    case 4:
                        _a = true;
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_1_1 = _g.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _g.trys.push([7, , 10, 11]);
                        if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _e.call(_b)];
                    case 8:
                        _g.sent();
                        _g.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12: return [2 /*return*/, result];
                }
            });
        });
    };
    return InfluxDBDataSource;
}());
exports.InfluxDBDataSource = InfluxDBDataSource;
