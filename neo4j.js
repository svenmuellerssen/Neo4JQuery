"use strict";

var _ = require('underscore')
  , _builderInstance = null
  , _graphInstance = null;


var Graph = function() {
  var queries = []
    , connection = null
    , QueryPlaceholders = []
    , parameters = {}
    , cachedQuery = '';

  /**
   *
   * @param graphConnection
   * @returns {Graph}
   */
  this.setConnection = function(graphConnection) {
    connection = graphConnection;

    if (!_.isNull(connection) && !_.isUndefined(connection)) {
      console.log('Connected to database "Neo4J".');
    }
    return this;
  };

  /**
   *
   * @param query
   * @param parameters
   * @param callback
   */
  this.Query = function(query, parameters, callback) {
    query = query || null;

    if (query && typeof query === 'string') {
      connection.query(query, parameters, function(err, result) {
        callback(err, result);
      });
    }
  };

  /**
   *
   * @param placeholder
   * @returns {Graph}
   */
  this.addQueryPlaceholder = function(placeholder) {
    placeholder = placeholder || null;

    if (!_.isNull(placeholder)) {
      QueryPlaceholders.push(placeholder);
    }

    return this;
  };

  /**
   *
   * @param placeholders
   * @param cached
   * @param callback
   */
  this.run = function(placeholders, cached, callback) {
    if (typeof cached === 'function') {
      callback = cached;
      cached = false;
    }

    var me = this
      , query = "";

    if (_.isNull(_builderInstance)) {
      callback({error: {message: "Builder was not used before execution.", code: 10100}});
    } else {
      if (cached === false) {
        cachedQuery = Builder.getQuery(placeholders);
      }

      query = cachedQuery;

      if (query === "") {
        callback({error: {message: "No query to execute.", code: 10101}});
      } else {
        // Query the database.
        me.Query(query, parameters, function(err, result) {
          query = null;
          callback(err, result);
        });
      }
    }

  };
};

/**
 *
 * @param connection
 * @returns {*}
 */
Graph.singleton = function(connection) {
  connection = connection || null;

  if (_.isNull(_graphInstance)) {
    _graphInstance = new Graph();
    if (!_.isNull(connection)) _graphInstance.setConnection(connection);
  }

  return _graphInstance;
};

/**
 *
 * @returns {*}
 * @constructor
 */
Graph.Builder = function() {
  if (_.isNull(_builderInstance)) {
    var Builder = require('Builder');
    _builderInstance = new Builder();
  }

  return _builderInstance;
};

module.exports = Graph;
