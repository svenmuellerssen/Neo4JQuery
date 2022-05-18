"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RestAPIConfig {
    constructor(config) {
        this.hostname = (config.hostname !== void 0) ? config.hostname : '';
        this.port = (config.port !== void 0) ? config.port : 0;
        this.protocol = (config.protocol !== void 0) ? config.protocol : '';
        this.auth = (config.auth !== void 0) ? config.auth : '';
        this.connectionName = (config.connectionName !== void 0) ? config.connectionName : '';
        this.path = (config.path !== void 0) ? config.path : '';
        this.method = (config.method !== void 0) ? config.method : '';
        this.headers = (config.headers !== void 0) ? config.headers : '';
        this.autoConnect = (config.autoConnect !== void 0) ? config.autoConnect : false;
        this.stream = (config.stream !== void 0) ? config.stream : false;
    }
}
exports.RestAPIConfig = RestAPIConfig;
