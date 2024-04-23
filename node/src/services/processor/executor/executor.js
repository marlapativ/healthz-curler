"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckExecutorFactory = void 0;
var healthcheck_1 = require("../../healthcheck/healthcheck");
var curl_executor_1 = require("./curl.executor");
var fetch_executor_1 = require("./fetch.executor");
var HealthCheckExecutorFactory = {
    get: function (healthCheck) {
        switch (healthCheck.executor) {
            case healthcheck_1.HealthCheckExecutorType.CURL:
                return new curl_executor_1.CurlExecutor(healthCheck);
            case healthcheck_1.HealthCheckExecutorType.FETCH:
            default:
                return new fetch_executor_1.FetchExecutor(healthCheck);
        }
    }
};
exports.HealthCheckExecutorFactory = HealthCheckExecutorFactory;
