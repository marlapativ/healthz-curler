"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSourceFactory = void 0;
var env_util_1 = require("../../../utils/env.util");
var inmemory_datasource_1 = require("./inmemory.datasource");
var redis_datasource_1 = require("./redis.datasource");
var logger_1 = require("../../../config/logger");
var logger = (0, logger_1.default)(import.meta.file);
var dataSource;
var dataSourceFactory = {
    get: function () {
        if (dataSource)
            return dataSource;
        var dataSourceType = env_util_1.default.getOrDefault('DATA_SOURCE', 'inmemory');
        logger.info("Creating new data source. Type: ".concat(dataSourceType));
        switch (dataSourceType) {
            case 'redis':
                dataSource = new redis_datasource_1.RedisDataSource();
                break;
            case 'inmemory':
            default:
                dataSource = new inmemory_datasource_1.InMemoryDataSource();
        }
        return dataSource;
    }
};
exports.dataSourceFactory = dataSourceFactory;
