import { IFunctionArguments } from './IFunctionArguments';
export declare class Builder {
    /**
     * The query string that will be send to the database system.
     * @property {string}
     */
    private query;
    /**
     * All query parts stored by the methods.
     * The will be glued when method "separator" is called.
     * @property {string[]}
     */
    private queryPartsBuffer;
    /**
     * All parameter values that are available in the query.
     * @property {any}
     */
    private parameterValues;
    /**
     * All placeholders coming with the key word methods.
     * @property {string[]}
     */
    private returnIdentifier;
    /**
     * Condition snippets for the where statement.
     * @property {string}
     */
    private where;
    /**
     * Collection of all "Where" conditions
     * especially OR and XOR.
     * @property {any}
     */
    private whereSnippets;
    /**
     * Collection of all "Where" conditions
     * connected with "AND".
     * @property {string}
     */
    private whereSnippetBuffer;
    /**
     *
     * @property {string}
     */
    private returnStatement;
    /**
     * Flag to signalize status of query. It is
     * used to decide if some functions
     * are for "WHERE" or "RETURN".
     * @property {boolean}
     */
    private isReturnSet;
    /**
     * Collection of "RETURN" segments.
     * @property {string[]}
     */
    private returnSnippetBuffer;
    private orderBy;
    private skip;
    private limit;
    private globalBuffer;
    private cacheQuery;
    /**
     * @constructor
     */
    constructor();
    /**
     * Get the Cypher query.
     *
     * @param graphTypes
     * @return {string}
     */
    getQuery(graphTypes?: any): string;
    /**
     * Get all parameter values used to prepare
     * Cypher query for execution.
     *
     * @return {any}
     */
    getParameters(): any;
    /**
     * Check if there is a query available.
     *
     * @return {boolean}
     */
    hasQuery(): boolean;
    /**
     * Separates different queries in a statement.
     * Putting an LF at the end.
     *
     * @return {Builder}
     */
    separator(): Builder;
    /**
     * Start cypher query.
     *
     * @param condition
     * @param parameterValues
     * @return {Builder}
     */
    Start(condition: string, parameterValues?: any): Builder;
    /**
     * Add "MATCH" statement to the query.
     *
     * @param identifier {string} identifier as node reference
     * @param label {string} A node label
     * @param parameterValues {any} All parameters referencing nodes
     * @param optional {boolean} Flag to set the "MATCH" statement as optional one.
     */
    Match(identifier: string, label?: string, parameterValues?: any | null, optional?: boolean): Builder;
    /**
     * Match or create a node with given parameters.
     *
     * @param identifier {string} Placeholder as node reference
     * @param label {string} A node label
     * @param parameterValues {any} All parameters of the node
     * @return {Builder}
     */
    Merge(identifier: string, label?: string, parameterValues?: any | null): Builder;
    /**
     *
     * @param type
     * @param identfier
     * @param parameterValues
     * @return {Builder}
     */
    Relate(type: string, identfier?: string, parameterValues?: any): Builder;
    /**
     *
     * @param label
     * @param identifier
     * @param parameterValues
     * @return {Builder}
     */
    ToNode(label: string[], identifier?: string, parameterValues?: any): Builder;
    /**
     * Add SET a statement.
     *
     * @todo Implement possibility to set labels
     * @todo and properties with one placeholder assigned with equal operator (like n=$props)
     * @todo Assign properties from maps (like n += {firstname: ..., lastname: ..., ...})
     *
     * @param identifiers {string[]|string} All identifiers used in SET statement.
     * @param values {any} All property->value pairs assigned to a placeholder key.
     */
    Set(identifiers?: string[] | string, values?: any): Builder;
    Where(property?: string, operator?: string, value?: string | number): Builder;
    /**
     * Add a condition to the where statement with "AND"
     *
     * @param operator {string} Operator from the list of cypher operator key words.
     * @param property {string} A node property
     * @param value {string|number} The value that has to be compared or operated on node property.
     * @return {Builder}
     */
    AND(operator: string, property: string, value?: string | number | number[] | string[]): Builder;
    /**
     * Add "OR" to the "WHERE" segment.
     *
     * @return {Builder}
     */
    OR(operator?: string, property?: string, value?: string | number | number[] | string[]): Builder;
    /**
     * Add "XOR" to the "WHERE" segment.
     *
     * @return {Builder}
     */
    XOR(): Builder;
    /**
     * Build a part of the where statement based on given parameter.
     *
     * @param operator {string} Operator from the list of cypher operator key words.
     * @param property {string} A node property
     * @param value {string|number} The value that has to be compared or operated on node property.
     * @return {string}
     */
    private buildQueryPart(operator, property, value?);
    /**
     * Add key word "WITH" and pipes all passed-in populates to the next statement.
     *
     * @param populate {string[]|string} Array of placeholders to be response by query.
     * @return {Builder}
     */
    With(populate: string[] | string): Builder;
    /**
     * Add "RETURN" key word and finish query building.
     *
     * If parameter $populate is not given all placeholder from
     * former queries will be returned. To avoid response
     * of all placeholders pass in an empty array.
     *
     * @param distinct {boolean} Flag that puts the key work "DISTINCT" to return statement.
     * @param populate {string[]|string|null} Array of placeholders to be response by query.
     * @return {string}
     * @todo Refactor method to collect all return items and functions.
     */
    Return(populate?: string[] | string, distinct?: boolean): Builder;
    /**
     * Add existence check.
     * The method knows to add check to where or return segment.
     * @param property {string} Property to check existence of.
     */
    Exists(property: string): Builder;
    /**
     * Returns specific number of characters of a string.
     *
     * @param original {string} Original string
     * @param length {number} Number of characters to return
     * @return {Builder}
     */
    Left(original: string, length: number): Builder;
    /**
     * Removes leading whitespaces and returns the rest.
     *
     * @param original {string} Original string
     * @return {Builder}
     */
    LTrim(original: string): Builder;
    Replace(original: string, haystack: string, replace: string): Builder;
    Reverse(original: string): Builder;
    Right(original: string, length: number): Builder;
    RTrim(original: string): Builder;
    Split(original: string, splitDelimiter: string): Builder;
    Substring(original: string, start: number, length?: number): Builder;
    ToLower(original: string): Builder;
    ToUpper(original: string): Builder;
    ToString(original: string | number | boolean): Builder;
    Trim(original: string): Builder;
    AndFunction(func: string, args: IFunctionArguments): Builder;
    /**
     * Tell cypher the guess of an index it can use.
     *
     * @param placeholder {string} Placeholder of filtered node
     * @param label {string} Nodes label
     * @param properties {string[]|string} Node properties that build a composite index
     * @return {Builder}
     */
    UsingIndexOn(placeholder: string, label: string, properties: string[]): Builder;
    /**
     * Order the result set depending on order of given node properties.
     *
     * @param condition {string} Node properties that makes the order of the result set.
     * @return {Builder}
     */
    OrderBy(condition?: string): Builder;
    /**
     * Limit the number of results.
     *
     * @param limit {number} Number of results to be fetch.
     * @return {Builder}
     */
    Limit(limit?: number): Builder;
    /**
     * Set number of entries to be skipped in result set.
     *
     * @param skip {number} Number to skip.
     * @return {Builder}
     */
    Skip(skip?: number): Builder;
    /**
     * Create a single or composite index.
     * @param label {string} Label to create an index for.
     * @param properties {string[]} Label properties for which the index shall be used.
     * @return {void}
     */
    CreateIndexOn(label: string, properties?: string[]): void;
    /**
     * Drop a single or composite index.
     * @param label {string} Label to create an index for.
     * @param properties {string[]} Label properties for which the index shall be used.
     * @return {void}
     */
    DropIndexOn(label: string, properties?: string[]): void;
    /**
     * Build an index statement (CREATE, DROP).
     * @param keyword {string}
     * @param label {string}
     * @param properties {string[]}
     */
    private buildIndexStatement(keyword, label, properties);
    /**
     * Add parameter values to internal parameters.
     * @param obj {any} Object with parameters
     * @return {Builder}
     */
    private mergeIntoParameters(obj);
    /**
     * Build a parameterised string.
     * @param separator {string} Separator of key and value (Normally ":" but could also be "placeholder.")
     * @param parameterValues {any} Parameters of a node/relationship or other conditions.
     * @return {string}
     */
    private buildParameterString(parameterValues?, separator?);
    /**
     * Reset the Cypher query builder.
     *
     * @return {Builder}
     */
    reset(): Builder;
    /**
     * Converts a comma separated list in a string into an array of strings.
     * @param stringList {string}
     * @return {string[]}
     */
    private buildArrayFromString(stringList?);
    /**
     * Removes whitespaces on left and right side of a string.
     *
     * @param value {string} Removes whitspaces
     */
    private trimValue(value);
    /**
     * Get an instance of the Cypher query builder.
     *
     * @return {Builder}
     */
    static instance(): Builder;
}
