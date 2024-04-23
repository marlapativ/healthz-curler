"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckExecutorType = exports.HealthCheckStatus = void 0;
var HealthCheckStatus;
(function (HealthCheckStatus) {
    HealthCheckStatus["HEALTHY"] = "healthy";
    HealthCheckStatus["UNHEALTHY"] = "unhealthy";
    HealthCheckStatus["DEGRADED"] = "degraded";
})(HealthCheckStatus || (exports.HealthCheckStatus = HealthCheckStatus = {}));
var HealthCheckExecutorType;
(function (HealthCheckExecutorType) {
    HealthCheckExecutorType["DEFAULT"] = "default";
    HealthCheckExecutorType["CURL"] = "curl";
    HealthCheckExecutorType["FETCH"] = "fetch";
})(HealthCheckExecutorType || (exports.HealthCheckExecutorType = HealthCheckExecutorType = {}));
