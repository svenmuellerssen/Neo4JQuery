export declare enum Errors {
    COMMON_CODE_NOT_AVAILABLE = "No error message available.",
    COMMON_ERROR_MESSAGE = "Error: Something went wrong.",
    BOLT_NO_CONNECTION_AVAILABLE = "No connection to the database available. Please connect first.",
    BOLT_GET_SESSION = "Error on getting bolt session.",
    BOLT_EXECUTE_CYPHER_QUERY = "Querying the data was not successful.",
    BUILDER_GENERIC_CASE_FIELD_MISSING = "Field is missing on generic case.",
    BUILDER_NO_WHEN_VALUE = "No value given.",
    BUILDER_THEN_CALLED_BEFORE_WHEN = "CASE method \"Then\" called before \"When\".",
    BUILDER_END_CALLED_BEFORE_WHEN = "CASE method \"End\" called before \"When\" or \"Then\".",
    COMMON_NO_QUERY_GIVEN = "No query to execute given.",
    BOLT_TRANSACTION_COMMIT_FAILS = "Error on execute transactions commit.",
    COMMON_TYPE_REST_DOES_NOT_SUPPORT_TRANSACTION = "This type does not support transactions: Neo4J Rest API",
}
