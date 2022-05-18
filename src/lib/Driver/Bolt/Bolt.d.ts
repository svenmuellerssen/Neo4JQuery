import { Driver } from '../Driver';
import { BoltConfig } from './BoltConfig';
import * as Neo4J from "neo4j-driver";
export declare class Bolt extends Driver {
    private sessions;
    private connection;
    private configuration;
    private graphTypes;
    private transactionStarted;
    constructor(configuration?: BoltConfig | null);
    /**
     * Get type of driver object.
     * @return {number}
     */
    getType(): number;
    /**
     * Check if there is a transaction started.
     * @return {boolean}
     */
    isTransactionStarted(): boolean;
    /**
     * Set a collection of classes to map the results into objects of classes.
     * @param types {any} Optional. The label assigned classes to map result labels.
     * @return {Bolt}
     */
    setGraphTypes(types?: any): Bolt;
    /**
     * Connect to a database with given configuration.
     * @param configuration {BoltConfig|null} Configuration to connect to database server system.
     * @return {Bolt}
     */
    connect(configuration?: BoltConfig | null): Bolt;
    /**
     * Check if there is an existing connection to the database server system.
     * @return {boolean}
     */
    hasConnection(): boolean;
    /**
     * Close driver object connection.
     * @return {Bolt}
     */
    close(): Bolt;
    /**
     * Get new instance of bolt session object to execute cypher query.
     * @param sessionName {string} The session name for multiple use of single connection.
     * @return {Neo4J.v1.Session|null}
     */
    getSession(sessionName?: string): Neo4J.v1.Session | null;
    /**
     * Execute the cypher query on a single session.
     *
     * @param sessionName {string} The session name for multiple use of single connection.
     * @param query {string} The cypher query to be executed.
     * @param parameters {any} The parameters to prepare the cypher query.
     * @return {Promise<any>}
     */
    execute(sessionName: string | undefined, query: string, parameters: any): Promise<any>;
    private convertRecordItem(item);
    /**
     * Get the url to connect to the database server system.
     * @return {string}
     */
    getUrl(): string;
    /**
     * Get a new bolt driver instance.
     *
     * @param configuration {IBoltConfig|null} Configuration to be able to connect driver session.
     * @return {Bolt}
     */
    static instance(configuration?: BoltConfig | null): Bolt;
}
