"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Driver_1 = require("../Driver");
const Neo4J = require("neo4j-driver");
class Bolt extends Driver_1.Driver {
    constructor(configuration = null) {
        super();
        this.configuration = configuration;
        this.sessions = {};
        this.connection = null;
        //this.transaction = null;
        this.graphTypes = {};
        this.transactionStarted = false;
        if (this.configuration !== null && this.configuration.autoConnect) {
            this.connect(null);
        }
    }
    /**
     * Get type of driver object.
     * @return {number}
     */
    getType() {
        return Driver_1.Driver.DRIVER_TYPE_BOLT;
    }
    /**
     * Check if there is a transaction started.
     * @return {boolean}
     */
    isTransactionStarted() {
        return this.transactionStarted;
    }
    /**
     * Set a collection of classes to map the results into objects of classes.
     * @param types {any} Optional. The label assigned classes to map result labels.
     * @return {Bolt}
     */
    setGraphTypes(types) {
        if (types !== void 0)
            this.graphTypes = types;
        return this;
    }
    /**
     * Connect to a database with given configuration.
     * @param configuration {BoltConfig|null} Configuration to connect to database server system.
     * @return {Bolt}
     */
    connect(configuration = null) {
        if (configuration !== null) {
            this.configuration = configuration;
        }
        if (this.configuration !== null) {
            // @todo configuration should have all parameters to connect with database server.
            const url = 'bolt://' +
                this.configuration.server +
                ((this.configuration.port !== null)
                    ? ':' + this.configuration.port
                    : '');
            // Configure bolt driver with or without authentication.
            var user = this.configuration.user, password = this.configuration.password;
            if (user !== '' && password !== '') {
                this.connection = Neo4J.v1.driver('' + url, Neo4J.v1.auth.basic(this.configuration.user, this.configuration.password));
            }
            else {
                this.connection = Neo4J.v1.driver(url);
            }
        }
        return this;
    }
    /**
     * Check if there is an existing connection to the database server system.
     * @return {boolean}
     */
    hasConnection() {
        return (this.connection !== null);
    }
    /**
     * Close driver object connection.
     * @return {Bolt}
     */
    close() {
        if (this.connection) {
            this.connection.close();
            this.connection = null;
        }
        return this;
    }
    /**
     * Get new instance of bolt session object to execute cypher query.
     * @param sessionName {string} The session name for multiple use of single connection.
     * @return {Neo4J.v1.Session|null}
     */
    getSession(sessionName = 'default') {
        if (this.sessions[sessionName] !== void 0) {
            return this.sessions[sessionName];
        }
        else if (this.connection !== null) {
            this.sessions[sessionName] = this.connection.session();
            return this.sessions[sessionName];
        }
        else {
            return null;
        }
    }
    /**
     * Execute the cypher query on a single session.
     *
     * @param sessionName {string} The session name for multiple use of single connection.
     * @param query {string} The cypher query to be executed.
     * @param parameters {any} The parameters to prepare the cypher query.
     * @return {Promise<any>}
     */
    execute(sessionName = 'default', query, parameters) {
        return new Promise((resolve, reject) => {
            const session = this.getSession(sessionName);
            if (session === null) {
                reject({ message: 'No connection available to get a session.', code: 0 });
            }
            else {
                const me = this;
                const results = [];
                const stream = session.run(query, parameters);
                stream.subscribe({
                    onNext: function onNext(record) {
                        let i = 0, j = record.length, item = null, newRecord = {};
                        for (; i < j; i++) {
                            item = record.get(record.keys[i]);
                            if (Array.isArray(item) && item.length > 0) {
                                newRecord[record.keys[i]] = item.map(item => {
                                    return me.convertRecordItem(item);
                                });
                            }
                            else {
                                newRecord[record.keys[i]] = me.convertRecordItem(item);
                            }
                        }
                        results.push(newRecord);
                    },
                    onCompleted: function onCompleted() {
                        resolve(results);
                    },
                    onError: function onError(error) {
                        reject({ message: 'Query the database was not successful.', code: 0, sysErr: error });
                    }
                });
            }
        });
    }
    convertRecordItem(item) {
        let me = this, type = '';
        //itemKeys = Object.keys(item);
        type = (item !== null && item.labels !== void 0) ? 'node' : (item !== null && item.type !== void 0) ? 'relationship' : null;
        if (type !== null) {
            switch (type) {
                case 'node':
                    let labels = item.labels, obj = null;
                    labels.forEach(function (label) {
                        if (me.graphTypes !== null && me.graphTypes[label] !== void 0) {
                            obj = new me.graphTypes[label]();
                            obj.set(item.properties, (err = null, obj) => {
                                // @todo Implement error handling
                                if (err)
                                    console.log(err);
                                obj.setId(Neo4J.v1.int(item.identity).toNumber());
                                item = obj;
                            });
                        }
                        else {
                            item.identity = Neo4J.v1.int(item.identity).toNumber();
                            let keys = null;
                            let properties = null;
                            if (item.properties !== void 0) {
                                keys = Object.keys(item.properties);
                                properties = item.properties;
                                delete item['properties'];
                            }
                            else {
                                keys = Object.keys(item);
                                properties = item;
                            }
                            for (let key of keys) {
                                if (key !== 'identifier')
                                    item[key] = properties[key];
                            }
                        }
                    });
                    break;
                case 'relationship':
                    /**
                     * @todo Implement structure for relationships.
                     */
                    break;
            }
        }
        return item;
    }
    /**
     * Get the url to connect to the database server system.
     * @return {string}
     */
    getUrl() {
        if (this.configuration) {
            return 'bolt://' +
                this.configuration.server +
                ((this.configuration.port !== null)
                    ? ':' + this.configuration.port
                    : '');
        }
        return '';
    }
    /**
     * Get a new bolt driver instance.
     *
     * @param configuration {IBoltConfig|null} Configuration to be able to connect driver session.
     * @return {Bolt}
     */
    static instance(configuration = null) {
        return new Bolt(configuration);
    }
}
exports.Bolt = Bolt;
