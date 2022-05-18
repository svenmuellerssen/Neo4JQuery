"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const Driver_1 = require("../Driver");
class Rest extends Driver_1.Driver {
    /**
     *
     * @param configuration
     */
    constructor(configuration) {
        super();
        //private graphTypes: any = null;
        this.configuration = null;
        this.configuration = configuration;
        if (this.configuration !== null && this.configuration.autoConnect) {
            this.connect(null);
        }
    }
    /**
     * Get the type of the current driver.
     * @return {number}
     */
    getType() {
        return Driver_1.Driver.DRIVER_TYPE_HTTP;
    }
    /**
     * Set a collection of classes to map the results into objects of classes.
     * @param types
     * @return {Rest}
     */
    setGraphTypes(types) {
        if (types !== void 0)
            types = [];
        //this.graphTypes = types;
        return this;
    }
    /**
     * Connect the driver with the server system via HTTP.
     * @param configuration {IRestAPIConfig|null} Configuration to connect to database server system.
     * @return {Rest}
     */
    connect(configuration = null) {
        if (configuration !== null) {
            this.configuration = configuration;
        }
        return this;
    }
    /**
     * Checks the possibility to connect on
     * request with configuration
     * parameters.
     *
     * There is no guarantee to be able to connect
     * with given configuration parameter.
     *
     * @return {boolean}
     */
    canConnect() {
        return (this.configuration !== null);
    }
    /**
     * Executes the cypher query via request
     * the database server system.
     *
     * @param query {string} Cypher statement
     * @param parameter {any} Parameters given to reduce matching results
     * @return {Promise<any>}
     */
    execute(query, parameter) {
        return new Promise((resolve, reject) => {
            if (this.configuration === null) {
                reject({ message: 'No connection to database available', code: 0 });
            }
            else {
                // @todo Implement ssl connection with https.
                const payload = JSON.stringify({
                    statements: [{
                            statement: query,
                            parameters: parameter
                        }]
                });
                // Build headers for query request.
                const headers = this.configuration.headers;
                headers['Content-Length'] = Buffer.byteLength(payload);
                if (this.configuration.stream)
                    headers['X-Stream'] = true;
                // Build request options
                const options = {
                    protocol: this.configuration.protocol,
                    hostname: this.configuration.hostname,
                    port: this.configuration.port,
                    method: 'POST',
                    path: (this.configuration.path) ? this.configuration.path : '/db/data/transaction/commit',
                    headers: headers,
                    auth: (this.configuration.auth) ? this.configuration.auth : '',
                    agent: false
                };
                const httpRequest = http.request(options, (res) => {
                    if (res.statusCode === 404 || res.statusCode === 500) {
                        reject({ message: `Error on request database server system (status code: ${res.statusCode})` });
                    }
                    else {
                        let data = '';
                        res.setEncoding('utf8');
                        res.on('data', (chunk) => {
                            data += chunk;
                        });
                        res.on('end', () => {
                            // @todo Map the result labels with assigned classes.
                            resolve(JSON.parse(data));
                        });
                    }
                });
                httpRequest.on('error', (e) => {
                    reject(e.message);
                });
                httpRequest.write(payload);
                httpRequest.end();
            }
        });
    }
    /**
     * Close driver object connection.
     * @return {Rest}
     */
    close() {
        this.configuration = null;
        return this;
    }
    /**
     * Get a new instance of REST driver object.
     * @return {Rest}
     */
    static instance(configuration = null) {
        return new Rest(configuration);
    }
}
exports.Rest = Rest;
