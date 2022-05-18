"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Builder_1 = require("./lib/Builder/Builder");
const index_1 = require("./index");
class Neo4JQuery {
    /**
     *
     * @param configuration
     */
    constructor(configuration) {
        this.configuration = configuration;
        this.cachedQuery = '';
        this.connections = {};
    }
    /**
     * Close all connections and flush the connection pool.
     * @return Neo4JQuery
     */
    flushConnections() {
        // Close all connections to the database.
        for (let name in this.connections) {
            this.connections[name].close();
        }
        ;
        // Reset connection hash map.
        // @todo Replace "IDriverMap" with new typescript concept of "Map" if it is more supported in browsers.
        this.connections = {};
        return this;
    }
    /**
     *
     * @param configuration
     * @return Neo4JQuery
     */
    connect(configuration) {
        if (configuration !== null) {
            this.configuration = configuration;
        }
        // Get needed connection name and depending driver with database connection.
        const connectionName = (this.configuration && this.configuration.connectionName)
            ? this.configuration.connectionName
            : 'default';
        let driver = (Object.keys(this.connections).length > 0 && this.connections[connectionName]) ? this.connections[connectionName] : null;
        if (driver === null) {
            if (this.configuration instanceof index_1.BoltConfig) {
                driver = index_1.Bolt.instance(this.configuration).connect();
            }
            else if (this.configuration instanceof index_1.RestAPIConfig) {
                driver = index_1.Rest.instance(this.configuration).connect();
            }
            if (driver !== null)
                this.connections[connectionName] = driver;
        }
        return this;
    }
    /**
     *
     * @param connectionName
     * @return Neo4JQuery
     */
    close(connectionName = null) {
        connectionName = (connectionName !== null) ? connectionName : 'default';
        if (this.connections[connectionName] !== void 0) {
            this.connections[connectionName].close();
        }
        return this;
    }
    /**
     * Set a collection of classes to map the results into objects of classes.
     * @param map
     * @return Neo4JQuery
     */
    registerResultMappings(map = []) {
        if (map.length !== 0) {
            map = [];
            //this.resultClassMap = map;
        }
        return this;
    }
    /**
     * Get specific driver
     * @param connectionName {string}
     * @return {Driver|null}
     */
    getDriver(connectionName = '') {
        return (this.connections[connectionName] !== void 0) ? this.connections[connectionName] : null;
    }
    /**
     * Check specific driver connection.
     * @param connectionName {string}
     * @return {boolean}
     */
    isConnected(connectionName = '') {
        const driver = (this.connections[connectionName] !== void 0) ? this.connections[connectionName] : null;
        if (driver === null) {
            return false;
        }
        else {
            if (driver instanceof index_1.Bolt) {
                return driver.hasConnection();
            }
            else if (driver instanceof index_1.Rest) {
                return driver.canConnect();
            }
            return false;
        }
    }
    /**
     * Executes the cypher query on given connection.
     * @param query
     * @param parameters
     * @param connection
     * @param session
     * @returns Promise<any>
     */
    query(query = '', parameters = {}, connection = 'default', session = 'default') {
        return new Promise((resolve, reject) => {
            // Get the driver to execute the query on.
            const driver = (this.connections[connection] !== void 0) ? this.connections[connection] : null;
            if (driver !== null) {
                if (driver instanceof index_1.Bolt) {
                    // Executes the cypher query on given bolt session.
                    driver.execute(session, query, parameters)
                        .then((data) => {
                        resolve(data);
                    })
                        .catch((error) => {
                        reject(error);
                    });
                }
                else {
                    // Executes the cypher query on given REST connection.
                    driver.execute(query, parameters)
                        .then((data) => {
                        resolve(data);
                    })
                        .catch((error) => {
                        reject(error);
                    });
                }
            }
            else {
                reject({ message: 'No driver found to execute cypher query.', code: 0 });
            }
        });
    }
    beginTransaction() { }
    commit() { }
    call() { }
    /**
     * Execute build cypher query with given options.
     * @param options {Neo4JQueryOptions}
     * @returns Promise<any>
     */
    execute(options) {
        return new Promise((resolve, reject) => {
            if (!options || !options.builder) {
                reject({ message: 'No builder with query available. You can use the method "query" without the need of a query builder.' });
            }
            else {
                if (!options.connection)
                    options.connection = 'default';
                if (!options.session)
                    options.session = 'default';
                if (!options.cached)
                    options.cached = false;
                if (!options.graphTypes || Object.keys(options.graphTypes).length === 0)
                    options.graphTypes = {};
                if (!options.close)
                    options.close = false;
                let query = '';
                // Cache the query
                if (options.cached === false) {
                    this.cachedQuery = options.builder.getQuery(options.graphTypes);
                }
                query = this.cachedQuery;
                this.query(query, options.builder.getParameters(), options.connection, options.session)
                    .then((data) => {
                    resolve(data);
                })
                    .catch((error) => {
                    reject(error);
                });
            }
        });
    }
    /**
     * @return Neo4JQuery
     */
    static singleton(configuration = null) {
        // Type guard looking for "null"
        if (this.instance === null) {
            this.instance = new Neo4JQuery(configuration);
        }
        return this.instance;
    }
}
Neo4JQuery.instance = null;
/**
 * @property builder {Builder}
 */
Neo4JQuery.Builder = Builder_1.Builder.instance();
exports.Neo4JQuery = Neo4JQuery;
