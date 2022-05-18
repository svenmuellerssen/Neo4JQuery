export interface IRestAPIConfig {
    /**
     * URL of the database system.
     */
    readonly hostname: string;
    /**
     * Port where the database system is listening.
     */
    readonly port: number;
    /**
     * Connection protocol like http or https.
     */
    readonly protocol: string;
    /**
     * Auth has the format of 'user:password'
     */
    readonly auth?: string;
    /**
     * Name of the single driver connection
     */
    readonly connectionName?: string;
    /**
     * Path to database, e.g. "transaction/commit/"
     */
    readonly path?: string;
    /**
     * The REST method like "POST" or "GET"
     */
    readonly method?: string;
    /**
     * Headers with format: {'Content-Type': 'application/json', ...}
     * The single quotes for the object keys are necessary
     * because of inital capital letters and the dashes.
     */
    readonly headers?: any;
    /**
     * Flag to switch to stream response.
     */
    readonly stream: boolean;
    /**
     * Flag to automatically connect with
     * database on driver instantiation.
     */
    readonly autoConnect?: boolean;
}
