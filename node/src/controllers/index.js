"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRoutes = void 0;
var healthcheck_controller_1 = require("./healthcheck.controller");
var healthgraph_controller_1 = require("./healthgraph.controller");
var routes = function (server) {
    return server.group('/healthcheck', healthcheck_controller_1.healthCheckRouter).group('/healthgraph', healthgraph_controller_1.healthGraphRouter);
};
var apiRoutes = function (server) {
    return server.group('/api/v1', function (api) { return routes(api); });
};
exports.apiRoutes = apiRoutes;
