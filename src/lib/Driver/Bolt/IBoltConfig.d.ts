export interface IBoltConfig {
    /**
     * URL of the database system.
     */
    readonly server: string;
    /**
   * Port where the database system is listening.
   */
    readonly port: number;
    /**
     * The username to authenticate the connection.
     */
    readonly user?: string;
    /**
     * The password to authenticate the connection.
     */
    readonly password?: string;
    /**
   * Name of the single driver connection
   */
    readonly connectionName?: string;
    /**
   * Flag to automatically connect with
   * database on driver instantiation.
   */
    readonly autoConnect?: boolean;
}
