import { Driver } from '../Driver';
import { RestAPIConfig } from './RestAPIConfig';
export declare class Rest extends Driver {
    private configuration;
    /**
     *
     * @param configuration
     */
    constructor(configuration: RestAPIConfig | null);
    /**
     * Get the type of the current driver.
     * @return {number}
     */
    getType(): number;
    /**
     * Set a collection of classes to map the results into objects of classes.
     * @param types
     * @return {Rest}
     */
    setGraphTypes(types?: any): Rest;
    /**
     * Connect the driver with the server system via HTTP.
     * @param configuration {IRestAPIConfig|null} Configuration to connect to database server system.
     * @return {Rest}
     */
    connect(configuration?: RestAPIConfig | null): Rest;
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
    canConnect(): boolean;
    /**
     * Executes the cypher query via request
     * the database server system.
     *
     * @param query {string} Cypher statement
     * @param parameter {any} Parameters given to reduce matching results
     * @return {Promise<any>}
     */
    execute(query: string, parameter: any): Promise<any>;
    /**
     * Close driver object connection.
     * @return {Rest}
     */
    close(): Rest;
    /**
     * Get a new instance of REST driver object.
     * @return {Rest}
     */
    static instance(configuration?: RestAPIConfig | null): Rest;
}
