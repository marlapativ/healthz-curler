"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeSeriesDataSourceFactory = void 0;
var env_util_1 = require("../../../utils/env.util");
var influx_timeseries_1 = require("./influx.timeseries");
var logger_1 = require("../../../config/logger");
var logger = (0, logger_1.default)(import.meta.file);
var timeSeriesDataSource;
var timeSeriesDataSourceFactory = {
    get: function () {
        if (timeSeriesDataSource)
            return timeSeriesDataSource;
        var dataSourceType = env_util_1.default.getOrDefault('TIMESERIES_DATA_SOURCE', 'influx');
        logger.info("Creating new time series data source. Type: ".concat(dataSourceType));
        switch (dataSourceType) {
            case 'influx':
            default:
                timeSeriesDataSource = new influx_timeseries_1.InfluxDBDataSource();
        }
        return timeSeriesDataSource;
    }
};
exports.timeSeriesDataSourceFactory = timeSeriesDataSourceFactory;
