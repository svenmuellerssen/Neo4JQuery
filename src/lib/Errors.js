"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Errors;
(function (Errors) {
    Errors["COMMON_CODE_NOT_AVAILABLE"] = "No error message available.";
    Errors["COMMON_ERROR_MESSAGE"] = "Error: Something went wrong.";
    Errors["BOLT_NO_CONNECTION_AVAILABLE"] = "No connection to the database available. Please connect first.";
    Errors["BOLT_GET_SESSION"] = "Error on getting bolt session.";
    Errors["BOLT_EXECUTE_CYPHER_QUERY"] = "Querying the data was not successful.";
    Errors["BUILDER_GENERIC_CASE_FIELD_MISSING"] = "Field is missing on generic case.";
    Errors["BUILDER_NO_WHEN_VALUE"] = "No value given.";
    Errors["BUILDER_THEN_CALLED_BEFORE_WHEN"] = "CASE method \"Then\" called before \"When\".";
    Errors["BUILDER_END_CALLED_BEFORE_WHEN"] = "CASE method \"End\" called before \"When\" or \"Then\".";
    Errors["COMMON_NO_QUERY_GIVEN"] = "No query to execute given.";
    Errors["BOLT_TRANSACTION_COMMIT_FAILS"] = "Error on execute transactions commit.";
    Errors["COMMON_TYPE_REST_DOES_NOT_SUPPORT_TRANSACTION"] = "This type does not support transactions: Neo4J Rest API";
})(Errors = exports.Errors || (exports.Errors = {}));
