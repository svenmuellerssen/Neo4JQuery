import { Builder } from './lib/Builder/Builder';
import { Bolt, BoltConfig, Rest, RestAPIConfig } from './index';
export interface Neo4JQueryOptions {
    builder: Builder | null;
    cached: boolean;
    connection: string;
    session: string;
    graphTypes: any;
    close: boolean;
}
export declare class Neo4JQuery {
    private static instance;
    private configuration;
    private connections;
    /**
     * @property cachedQuery {string}
     */
    private cachedQuery;
    /**
     * @property builder {Builder}
     */
    static Builder: Builder;
    /**
     *
     * @param configuration
     */
    constructor(configuration: BoltConfig | RestAPIConfig | null);
    /**
     * Close all connections and flush the connection pool.
     * @return Neo4JQuery
     */
    flushConnections(): Neo4JQuery;
    /**
     *
     * @param configuration
     * @return Neo4JQuery
     */
    connect(configuration: BoltConfig | RestAPIConfig | null): Neo4JQuery;
    /**
     *
     * @param connectionName
     * @return Neo4JQuery
     */
    close(connectionName?: string | null): Neo4JQuery;
    /**
     * Set a collection of classes to map the results into objects of classes.
     * @param map
     * @return Neo4JQuery
     */
    registerResultMappings(map?: any[]): Neo4JQuery;
    /**
     * Get specific driver
     * @param connectionName {string}
     * @return {Driver|null}
     */
    getDriver(connectionName?: string): Bolt | Rest | null;
    /**
     * Check specific driver connection.
     * @param connectionName {string}
     * @return {boolean}
     */
    isConnected(connectionName?: string): boolean;
    /**
     * Executes the cypher query on given connection.
     * @param query
     * @param parameters
     * @param connection
     * @param session
     * @returns Promise<any>
     */
    query(query?: string, parameters?: any, connection?: string, session?: string): Promise<any>;
    beginTransaction(): void;
    commit(): void;
    call(): void;
    /**
     * Execute build cypher query with given options.
     * @param options {Neo4JQueryOptions}
     * @returns Promise<any>
     */
    execute(options: Neo4JQueryOptions): Promise<any>;
    /**
     * @return Neo4JQuery
     */
    static singleton(configuration?: BoltConfig | RestAPIConfig | null): Neo4JQuery;
}
