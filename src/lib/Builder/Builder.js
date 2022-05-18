"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CypherKeyWords_1 = require("./CypherKeyWords");
const CypherOperatorKeyWords_1 = require("./CypherOperatorKeyWords");
const CypherStringFunctionKeyWords_1 = require("./CypherStringFunctionKeyWords");
class Builder {
    /**
     * @constructor
     */
    constructor() {
        // Inital setting of builder properties.
        this.query = '';
        this.queryPartsBuffer = [];
        this.parameterValues = {};
        this.returnIdentifier = [];
        this.where = '';
        this.whereSnippetBuffer = [];
        this.whereSnippets = {
            or: [],
            xor: []
        };
        this.returnStatement = '';
        this.isReturnSet = false;
        this.returnSnippetBuffer = [];
        this.orderBy = '';
        this.skip = '';
        this.limit = '';
        this.globalBuffer = [];
        this.cacheQuery = '';
    }
    /**
     * Get the Cypher query.
     *
     * @param graphTypes
     * @return {string}
     */
    getQuery(graphTypes = {}) {
        graphTypes;
        this.separator();
        if (this.isReturnSet === true) {
            this.query += this.returnStatement + this.returnSnippetBuffer.join(',') + this.orderBy + this.skip + this.limit + ";";
            this.cacheQuery = this.query;
            this.query = '';
        }
        else {
            this.cacheQuery = this.query + ';';
            this.query = '';
        }
        return this.cacheQuery;
    }
    /**
     * Get all parameter values used to prepare
     * Cypher query for execution.
     *
     * @return {any}
     */
    getParameters() {
        return this.parameterValues;
    }
    /**
     * Check if there is a query available.
     *
     * @return {boolean}
     */
    hasQuery() {
        return (this.query.length > 0);
    }
    /**
     * Separates different queries in a statement.
     * Putting an LF at the end.
     *
     * @return {Builder}
     */
    separator() {
        /**
         * 1. MATCH
         * 2. MERGE
         * 3. WITH
         * 4. SET
         */
        if (this.queryPartsBuffer.length > 0) {
            // Add line feed when query buffer was emptied before.
            if (this.query !== '')
                this.query += "\n";
            // Add buffer entries concatenated.
            this.query += this.queryPartsBuffer.join("\n");
            // Empty query buffer.
            this.queryPartsBuffer.length = 0;
        }
        if (this.globalBuffer.length > 0) {
            this.query += this.globalBuffer.join('');
            this.globalBuffer.length = 0;
        }
        /**
         * 1. WHERE
         * 2. Exists
         */
        if (this.where !== '' && this.where === "\n" + 'WHERE ') {
            let addWhere = false;
            // Empty the where snippet part buffer
            if (this.whereSnippets.or.length > 0) {
                this.OR();
                addWhere = true;
            }
            else if (this.whereSnippets.xor.length > 0) {
                this.XOR();
                addWhere = true;
            }
            if (this.whereSnippetBuffer.length > 0) {
                this.where += this.whereSnippetBuffer.join(' AND ');
                addWhere = true;
            }
            if (addWhere) {
                this.where += this.whereSnippets.or.join(' OR ');
                this.whereSnippets.or.length = 0;
                this.where += this.whereSnippets.xor.join(' XOR ');
                this.whereSnippets.xor.length = 0;
                this.query += this.where;
                this.where = '';
            }
        }
        return this;
    }
    /**
     * Start cypher query.
     *
     * @param condition
     * @param parameterValues
     * @return {Builder}
     */
    Start(condition, parameterValues = {}) {
        this.query = CypherKeyWords_1.CypherKeyWords.START + condition;
        this.mergeIntoParameters(parameterValues);
        return this;
    }
    /**
     * Add "MATCH" statement to the query.
     *
     * @param identifier {string} identifier as node reference
     * @param label {string} A node label
     * @param parameterValues {any} All parameters referencing nodes
     * @param optional {boolean} Flag to set the "MATCH" statement as optional one.
     */
    Match(identifier, label = '', parameterValues = null, optional = false) {
        // Add identifier to return on query execution.
        this.returnIdentifier.push(identifier);
        /**
         * Flush where and query buffer. This is needed on composed Cypher
         * query with"START", "MATCH" or "MERGE" statements.
         */
        if (this.whereSnippetBuffer.length > 0) {
            this.separator();
        }
        // Create "MATCH" statement with node and parameters.
        let query = '(' + identifier;
        if (label !== '') {
            query += ':' + label + '';
        }
        query += this.buildParameterString(parameterValues) + ')';
        if (optional) {
            this.queryPartsBuffer.push(CypherKeyWords_1.CypherKeyWords.OPTIONAL_MATCH + query);
        }
        else {
            this.queryPartsBuffer.push(CypherKeyWords_1.CypherKeyWords.MATCH + query);
        }
        this.mergeIntoParameters(parameterValues);
        return this;
    }
    /**
     * Match or create a node with given parameters.
     *
     * @param identifier {string} Placeholder as node reference
     * @param label {string} A node label
     * @param parameterValues {any} All parameters of the node
     * @return {Builder}
     */
    Merge(identifier, label = '', parameterValues = null) {
        // Add identifier to return on query execution.
        this.returnIdentifier.push(identifier);
        /**
         * Flush where and query buffer. This is needed on composed Cypher
         * query with"START", "MATCH" or "MERGE" statements.
         */
        if (this.whereSnippetBuffer.length > 0) {
            this.separator();
        }
        // Create "MATCH" statement with node and parameters.
        let query = '(' + identifier;
        if (label !== '') {
            query += ':' + label + '';
        }
        query += this.buildParameterString(parameterValues) + ')';
        this.queryPartsBuffer.push(CypherKeyWords_1.CypherKeyWords.MERGE + query);
        this.mergeIntoParameters(parameterValues);
        return this;
    }
    /**
     *
     * @param type
     * @param identfier
     * @param parameterValues
     * @return {Builder}
     */
    Relate(type, identfier = '', parameterValues) {
        if (parameterValues === void 0)
            parameterValues = null;
        const queryPart = '-[' + identfier + ':' + type + this.buildParameterString(parameterValues) + ']-';
        this.globalBuffer.push(queryPart);
        return this;
    }
    /**
     *
     * @param label
     * @param identifier
     * @param parameterValues
     * @return {Builder}
     */
    ToNode(label, identifier = '', parameterValues) {
        let node = '(';
        if (identifier !== void 0) {
            node += identifier;
        }
        if (label.length > 0) {
            node = node + ':' + label.join(':');
        }
        if (parameterValues !== void 0) {
            node += this.buildParameterString(parameterValues);
        }
        node += ')';
        this.globalBuffer.push(node);
        // let buffer = this.globalBuffer.join('');
        // this.globalBuffer.length = 0;
        // this.queryPartsBuffer.push(buffer + query);
        if (identifier !== '')
            this.returnIdentifier.push(identifier);
        this.mergeIntoParameters(parameterValues);
        return this;
    }
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
    Set(identifiers = '', values = {}) {
        let keys = Object.keys(values), 
        /**
         * Creates a list of placeholder parameters with assigned values.
         *
         * @param placeholder {string} Placeholder to be used for the parameter list.
         * @param values {any} All parameters that has to be assigned to the placeholder.
         */
        buildInternalParameterString = (placeholder, parameter) => {
            let chain = '';
            if (placeholder !== '' && parameter !== void 0 && parameter !== null) {
                chain = this.buildParameterString(parameter, placeholder + '.');
                this.mergeIntoParameters(parameter);
            }
            return chain;
        };
        // Create array of placeholder from string.
        if (typeof identifiers === 'string')
            identifiers = this.buildArrayFromString(identifiers);
        let assignments = '';
        // We have exactly 1 placeholder
        if (identifiers.length === 1) {
            if (values[identifiers[0]] !== void 0 && values[identifiers[0]] !== null) {
                // The parameter values are assigned to a placeholder key.
                assignments = buildInternalParameterString(identifiers[0], values[identifiers[0]]);
            }
            else if (keys.length > 0) {
                // The parameter values does not have a placeholder key.
                assignments = buildInternalParameterString(identifiers[0], values);
            }
            else if (!Array.isArray(identifiers)) {
                // Ok, so we only have a placeholder and think that this is the whole assignment.
                assignments = identifiers;
            }
        }
        else if (identifiers.length > 1) {
            // The array of placeholders are more than one.
            let j = identifiers.length;
            // Start assignment of identifiers and referenced values in parameters.
            // So we need an assignment of parameter values to key of identifiers.
            for (let index = 0; index < j; index++) {
                assignments += buildInternalParameterString(identifiers[index], values[identifiers[index]]) + ',';
            }
            // Clean the assigned parameter values string at the end (we have a comma tail)
            if (assignments !== '')
                assignments = assignments.substr(0, assignments.length - 1);
        }
        if (assignments !== '') {
            // Start statement with SET and go on with the assignments string.
            let query = CypherKeyWords_1.CypherKeyWords.SET + assignments;
            // Add statement to the query buffer.
            this.queryPartsBuffer.push(query);
        }
        return this;
    }
    Where(property, operator, value) {
        /**
         * 1. String
         * 2. Function usage like "exists(n.property)"
         * 3. String comparison like "n.property CONTAINS 'ted'" or "NOT n.propery STARTS WITH 'cond'"
         * 4. RegEx usage like "n.property =~ '[0-9a-zA-Z]{2,4}.*'" or "n.property =~ 'ted*'"
         */
        this.where = "\n" + CypherKeyWords_1.CypherKeyWords.WHERE;
        this.whereSnippetBuffer.length = 0;
        this.whereSnippets.or.length = 0;
        this.whereSnippets.xor.length = 0;
        if (property !== void 0 && operator !== void 0) {
            this.AND(operator, property, value);
        }
        // @todo Adding given parameter to the snippet basket.
        return this;
    }
    /**
     * Add a condition to the where statement with "AND"
     *
     * @param operator {string} Operator from the list of cypher operator key words.
     * @param property {string} A node property
     * @param value {string|number} The value that has to be compared or operated on node property.
     * @return {Builder}
     */
    AND(operator, property, value = '') {
        const queryPart = this.buildQueryPart(operator, property, value);
        if (queryPart !== '')
            this.whereSnippetBuffer.push(queryPart);
        return this;
    }
    /**
     * Add "OR" to the "WHERE" segment.
     *
     * @return {Builder}
     */
    OR(operator = '', property = '', value = '') {
        if (this.whereSnippetBuffer.length > 0) {
            const query = '(' + this.whereSnippetBuffer.join(' AND ') + ')';
            this.whereSnippets.or.push(query);
            this.whereSnippetBuffer.length = 0;
        }
        this.AND(operator, property, value);
        return this;
    }
    /**
     * Add "XOR" to the "WHERE" segment.
     *
     * @return {Builder}
     */
    XOR() {
        const query = '(' + this.whereSnippetBuffer.join(' AND ') + ')';
        this.whereSnippets.xor.push(query);
        this.whereSnippetBuffer.length = 0;
        return this;
    }
    /**
     * Build a part of the where statement based on given parameter.
     *
     * @param operator {string} Operator from the list of cypher operator key words.
     * @param property {string} A node property
     * @param value {string|number} The value that has to be compared or operated on node property.
     * @return {string}
     */
    buildQueryPart(operator, property, value = '') {
        let query = '';
        if (value !== '' || (Array.isArray(value) && value.length === 0)) {
            switch (operator) {
                case CypherOperatorKeyWords_1.CypherOperatorKeyWords.LESS_THAN:
                    query = property + '<' + value;
                    break;
                case CypherOperatorKeyWords_1.CypherOperatorKeyWords.LESS_EQUAL_THAN:
                    query = property + '<=' + value;
                    break;
                case CypherOperatorKeyWords_1.CypherOperatorKeyWords.GREATER_THAN:
                    query = property + '>' + value;
                    break;
                case CypherOperatorKeyWords_1.CypherOperatorKeyWords.GREATER_EQUAL_THAN:
                    query = property + '>=' + value;
                    break;
                case CypherOperatorKeyWords_1.CypherOperatorKeyWords.EQUAL_THAN:
                    if (typeof value === 'string')
                        value = "'" + value + "'";
                    query = property + '=' + value;
                    break;
                case CypherOperatorKeyWords_1.CypherOperatorKeyWords.IS_IN:
                    if (Array.isArray(value) && value.length > 0) {
                        query = property + ' IN [' + value.join(',') + '] ';
                    }
                    else {
                        query = property + ' IN [' + value + '] ';
                    }
                    break;
                case CypherOperatorKeyWords_1.CypherOperatorKeyWords.STARTS_WITH:
                    query = property + " STARTS WITH '" + value + "'";
                    break;
                case CypherOperatorKeyWords_1.CypherOperatorKeyWords.NOT_STARTS_WITH:
                    query = 'NOT ' + property + " STARTS WITH '" + value + "'";
                    break;
                case CypherOperatorKeyWords_1.CypherOperatorKeyWords.ENDS_WITH:
                    query = property + " ENDS WITH '" + value + "'";
                    break;
                case CypherOperatorKeyWords_1.CypherOperatorKeyWords.NOT_ENDS_WITH:
                    query = 'NOT ' + property + " ENDS WITH '" + value + "'";
                    break;
                case CypherOperatorKeyWords_1.CypherOperatorKeyWords.CONTAINS:
                    query = property + " CONTAINS '" + value + "'";
                    break;
                case CypherOperatorKeyWords_1.CypherOperatorKeyWords.NOT_CONTAINS:
                    query = 'NOT ' + property + " CONTAINS '" + value + "'";
                    break;
            }
        }
        else {
            switch (operator) {
                case CypherOperatorKeyWords_1.CypherOperatorKeyWords.IS_NOT_NULL:
                    query = property + ' IS NOT NULL';
                    break;
                case CypherOperatorKeyWords_1.CypherOperatorKeyWords.IS_NULL:
                    query = property + ' IS NULL';
                    break;
                case CypherOperatorKeyWords_1.CypherOperatorKeyWords.FUNCTION_EXISTS:
                    query = 'exists(' + property + ')';
                    break;
            }
        }
        return query;
    }
    /**
     * Add key word "WITH" and pipes all passed-in populates to the next statement.
     *
     * @param populate {string[]|string} Array of placeholders to be response by query.
     * @return {Builder}
     */
    With(populate) {
        let query = '';
        // Create array of placeholder from string.
        if (typeof populate === 'string')
            populate = this.buildArrayFromString(populate);
        // Create a string of placeholders and add them to the query.
        if (Array.isArray(populate) && populate.length > 0) {
            query += CypherKeyWords_1.CypherKeyWords.WITH;
            query += populate.join(',');
        }
        // Add return query part to new line.
        if (query !== '') {
            this.separator();
            this.queryPartsBuffer.push(query);
        }
        return this;
    }
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
    Return(populate = [], distinct = false) {
        this.returnStatement = "\n" + CypherKeyWords_1.CypherKeyWords.RETURN;
        // Add distinct key word.
        if (distinct === true) {
            this.returnStatement += CypherKeyWords_1.CypherKeyWords.DISTINCT;
        }
        // Create the populate variable.
        if (Array.isArray(populate) && populate.length === 0) {
            // Unify identifier to be returned.
            populate = this.returnIdentifier.filter((elem, pos, arr) => {
                return arr.indexOf(elem) == pos;
            });
        }
        // Create array of placeholder from string.
        if (typeof populate === 'string')
            populate = this.buildArrayFromString(populate);
        // Create a string of placeholders and add them to the query.
        if (Array.isArray(populate) && populate.length > 0) {
            this.returnSnippetBuffer.push(populate.join(','));
        }
        this.isReturnSet = true;
        return this;
    }
    /**
     * Add existence check.
     * The method knows to add check to where or return segment.
     * @param property {string} Property to check existence of.
     */
    Exists(property) {
        if (this.isReturnSet === false) {
            // Function is used as "WHERE" condition.
            this.whereSnippetBuffer.push(this.buildQueryPart(CypherOperatorKeyWords_1.CypherOperatorKeyWords.FUNCTION_EXISTS, property));
        }
        else {
            // Function is used in "RETURN" segment.
            this.returnSnippetBuffer.push("exists(" + property + ")");
        }
        return this;
    }
    /**
     * Returns specific number of characters of a string.
     *
     * @param original {string} Original string
     * @param length {number} Number of characters to return
     * @return {Builder}
     */
    Left(original, length) {
        this.AndFunction(CypherStringFunctionKeyWords_1.CypherStringFunctionKeyWords.FUNCTION_LEFT, { original: original, length: length });
        return this;
    }
    /**
     * Removes leading whitespaces and returns the rest.
     *
     * @param original {string} Original string
     * @return {Builder}
     */
    LTrim(original) {
        this.AndFunction(CypherStringFunctionKeyWords_1.CypherStringFunctionKeyWords.FUNCTION_LTRIM, { original: original });
        return this;
    }
    Replace(original, haystack, replace) {
        this.AndFunction(CypherStringFunctionKeyWords_1.CypherStringFunctionKeyWords.FUNCTION_REPLACE, { original: original, haystack: haystack, replace: replace });
        return this;
    }
    Reverse(original) {
        this.AndFunction(CypherStringFunctionKeyWords_1.CypherStringFunctionKeyWords.FUNCTION_REVERSE, { original: original });
        return this;
    }
    Right(original, length) {
        this.AndFunction(CypherStringFunctionKeyWords_1.CypherStringFunctionKeyWords.FUNCTION_RIGHT, { original: original, length: length });
        return this;
    }
    RTrim(original) {
        this.AndFunction(CypherStringFunctionKeyWords_1.CypherStringFunctionKeyWords.FUNCTION_RTRIM, { original: original });
        return this;
    }
    Split(original, splitDelimiter) {
        this.AndFunction(CypherStringFunctionKeyWords_1.CypherStringFunctionKeyWords.FUNCTION_SPLIT, { original: original, delimiter: splitDelimiter });
        return this;
    }
    Substring(original, start, length = 0) {
        this.AndFunction(CypherStringFunctionKeyWords_1.CypherStringFunctionKeyWords.FUNCTION_SUBSTRING, { original: original, start: start, length: length });
        return this;
    }
    ToLower(original) {
        this.AndFunction(CypherStringFunctionKeyWords_1.CypherStringFunctionKeyWords.FUNCTION_TO_LOWER, { original: original });
        return this;
    }
    ToUpper(original) {
        this.AndFunction(CypherStringFunctionKeyWords_1.CypherStringFunctionKeyWords.FUNCTION_TO_UPPER, { original: original });
        return this;
    }
    ToString(original) {
        this.AndFunction(CypherStringFunctionKeyWords_1.CypherStringFunctionKeyWords.FUNCTION_TO_STRING, { original: original });
        return this;
    }
    Trim(original) {
        this.AndFunction(CypherStringFunctionKeyWords_1.CypherStringFunctionKeyWords.FUNCTION_TRIM, { original: original });
        return this;
    }
    AndFunction(func, args) {
        let expression = '';
        switch (func) {
            case CypherStringFunctionKeyWords_1.CypherStringFunctionKeyWords.FUNCTION_LEFT:
                expression = "left('" + args.original + "'," + args.length + ")";
                break;
            case CypherStringFunctionKeyWords_1.CypherStringFunctionKeyWords.FUNCTION_LTRIM:
                expression = "ltrim('" + args.original + "')";
                break;
            case CypherStringFunctionKeyWords_1.CypherStringFunctionKeyWords.FUNCTION_REPLACE:
                expression = "replace('" + args.original + "','" + args.haystack + "','" + args.replace + "')";
                break;
            case CypherStringFunctionKeyWords_1.CypherStringFunctionKeyWords.FUNCTION_REVERSE:
                expression = "reverse('" + args.original + "')";
                break;
            case CypherStringFunctionKeyWords_1.CypherStringFunctionKeyWords.FUNCTION_RIGHT:
                expression = "right('" + args.original + "'," + args.length + ")";
                break;
            case CypherStringFunctionKeyWords_1.CypherStringFunctionKeyWords.FUNCTION_RTRIM:
                expression = "rtrim('" + args.original + "')";
                break;
            case CypherStringFunctionKeyWords_1.CypherStringFunctionKeyWords.FUNCTION_SPLIT:
                expression = "split('" + args.original + "','" + args.delimiter + "')";
                break;
            case CypherStringFunctionKeyWords_1.CypherStringFunctionKeyWords.FUNCTION_SUBSTRING:
                expression = "substring('" + args.original + "'," + args.start;
                if (args.length !== void 0 && args.length > 0)
                    expression += "," + args.length;
                expression += ")";
                break;
            case CypherStringFunctionKeyWords_1.CypherStringFunctionKeyWords.FUNCTION_TO_LOWER:
                expression = "toLower('" + args.original + "')";
                break;
            case CypherStringFunctionKeyWords_1.CypherStringFunctionKeyWords.FUNCTION_TO_UPPER:
                expression = "toUpper('" + args.original + "')";
                break;
            case CypherStringFunctionKeyWords_1.CypherStringFunctionKeyWords.FUNCTION_TO_STRING:
                expression = "toString('" + args.original + "')";
                break;
            case CypherStringFunctionKeyWords_1.CypherStringFunctionKeyWords.FUNCTION_TRIM:
                expression = "trim('" + args.original + "')";
                break;
            case CypherStringFunctionKeyWords_1.CypherStringFunctionKeyWords.FUNCTION_EXISTS:
                expression = "exists(" + args.original + ")";
                break;
        }
        if (this.isReturnSet === false) {
            // Function is used as "WHERE" condition.
            this.whereSnippetBuffer.push(expression);
        }
        else {
            // Function is used in "RETURN" segment.
            this.returnSnippetBuffer.push(expression);
        }
        return this;
    }
    /**
     * Tell cypher the guess of an index it can use.
     *
     * @param placeholder {string} Placeholder of filtered node
     * @param label {string} Nodes label
     * @param properties {string[]|string} Node properties that build a composite index
     * @return {Builder}
     */
    UsingIndexOn(placeholder, label, properties) {
        if (properties.length > 0) {
            //USING INDEX liskov:Scientist(name)
            let query = CypherKeyWords_1.CypherKeyWords.USING_INDEX_ON + placeholder + ':' + label + '(';
            for (let property of properties) {
                query += property + ',';
            }
            query = query.substr(0, query.length - 1) + ')';
            this.queryPartsBuffer.push(query);
        }
        return this;
    }
    /**
     * Order the result set depending on order of given node properties.
     *
     * @param condition {string} Node properties that makes the order of the result set.
     * @return {Builder}
     */
    OrderBy(condition = '') {
        if (this.isReturnSet && condition !== '') {
            this.orderBy = "\n" + CypherKeyWords_1.CypherKeyWords.ORDER_BY + condition;
        }
        return this;
    }
    /**
     * Limit the number of results.
     *
     * @param limit {number} Number of results to be fetch.
     * @return {Builder}
     */
    Limit(limit = 100) {
        if (this.isReturnSet && limit >= 1) {
            this.limit = "\n" + CypherKeyWords_1.CypherKeyWords.LIMIT + limit;
        }
        return this;
    }
    /**
     * Set number of entries to be skipped in result set.
     *
     * @param skip {number} Number to skip.
     * @return {Builder}
     */
    Skip(skip = 0) {
        if (this.isReturnSet && skip >= 0) {
            this.skip = "\n" + CypherKeyWords_1.CypherKeyWords.SKIP + skip;
        }
        return this;
    }
    /**
     * Create a single or composite index.
     * @param label {string} Label to create an index for.
     * @param properties {string[]} Label properties for which the index shall be used.
     * @return {void}
     */
    CreateIndexOn(label, properties = []) {
        if (properties.length > 0)
            this.buildIndexStatement(CypherKeyWords_1.CypherKeyWords.CREATE_INDEX_ON, label, properties);
    }
    /**
     * Drop a single or composite index.
     * @param label {string} Label to create an index for.
     * @param properties {string[]} Label properties for which the index shall be used.
     * @return {void}
     */
    DropIndexOn(label, properties = []) {
        if (properties.length > 0)
            this.buildIndexStatement(CypherKeyWords_1.CypherKeyWords.DROP_INDEX_ON, label, properties);
    }
    /**
     * Build an index statement (CREATE, DROP).
     * @param keyword {string}
     * @param label {string}
     * @param properties {string[]}
     */
    buildIndexStatement(keyword, label, properties) {
        this.query = keyword + ':' + label + '(';
        for (let property of properties) {
            this.query += property + ',';
        }
        this.query = this.query.substr(0, this.query.length - 1) + ')';
    }
    /**
     * Add parameter values to internal parameters.
     * @param obj {any} Object with parameters
     * @return {Builder}
     */
    mergeIntoParameters(obj) {
        // @todo Separate unique key parameters from normal key parameter.
        this.parameterValues = Object.assign(this.parameterValues, obj);
        return this;
    }
    /**
     * Build a parameterised string.
     * @param separator {string} Separator of key and value (Normally ":" but could also be "placeholder.")
     * @param parameterValues {any} Parameters of a node/relationship or other conditions.
     * @return {string}
     */
    buildParameterString(parameterValues = null, separator = ':') {
        if (parameterValues === null) {
            return '';
        }
        else {
            const keys = Object.keys(parameterValues);
            if (keys.length === 0) {
                return '';
            }
            else {
                let string = '';
                if (separator === null) {
                    separator = ':';
                }
                if (separator === ':') {
                    string = ' {';
                }
                for (let key of keys) {
                    if (separator === ':') {
                        // Parameter format for node creation
                        if (typeof parameterValues[key] === 'string') {
                            string += key + separator + " '" + parameterValues[key] + "',";
                        }
                        else if (typeof parameterValues[key] === 'number') {
                            string += key + separator + ' ' + parameterValues[key] + ',';
                        }
                    }
                    else if (separator.indexOf('.') != -1) {
                        if (typeof parameterValues[key] === 'string') {
                            string += separator + key + "='" + parameterValues[key] + "',";
                        }
                        else if (typeof parameterValues[key] === 'number') {
                            string += separator + key + '=' + parameterValues[key] + ',';
                        }
                    }
                }
                if (string !== ' {') {
                    string = string.substr(0, string.length - 1);
                }
                if (separator === ':') {
                    string += '}';
                }
                return string;
            }
        }
    }
    /**
     * Reset the Cypher query builder.
     *
     * @return {Builder}
     */
    reset() {
        this.query = '';
        this.queryPartsBuffer.length = 0;
        this.where = '';
        this.whereSnippetBuffer.length = 0;
        this.whereSnippets.or.length = 0;
        this.whereSnippets.xor.length = 0;
        this.parameterValues.length = 0;
        this.returnIdentifier.length = 0;
        this.returnSnippetBuffer.length = 0;
        this.returnStatement = '';
        this.isReturnSet = false;
        this.orderBy = '';
        this.skip = '';
        this.limit = '';
        return this;
    }
    /**
     * Converts a comma separated list in a string into an array of strings.
     * @param stringList {string}
     * @return {string[]}
     */
    buildArrayFromString(stringList = '') {
        let arrayList = [];
        if (stringList.length > 0) {
            arrayList = stringList.split(',');
            arrayList = arrayList.map((placeholder) => {
                return this.trimValue(placeholder);
            });
        }
        return arrayList;
    }
    /**
     * Removes whitespaces on left and right side of a string.
     *
     * @param value {string} Removes whitspaces
     */
    trimValue(value) {
        value = value.replace(/^ /, '');
        return value.replace(/ $/, '');
    }
    /**
     * Get an instance of the Cypher query builder.
     *
     * @return {Builder}
     */
    static instance() {
        return new Builder();
    }
}
exports.Builder = Builder;
