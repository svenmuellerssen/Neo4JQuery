"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BoltConfig {
    constructor(config) {
        this.server = (config.server !== void 0) ? config.server : '';
        this.port = (config.port !== void 0) ? config.port : 0;
        this.user = (config.user !== void 0) ? config.user : '';
        this.password = (config.password !== void 0) ? config.password : '';
        this.connectionName = (config.connectionName !== void 0) ? config.connectionName : '';
        this.autoConnect = (config.autoConnect !== void 0) ? config.autoConnect : false;
    }
}
exports.BoltConfig = BoltConfig;
