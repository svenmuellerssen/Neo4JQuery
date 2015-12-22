"use strict";

var _ = require('underscore')
  , Builder = require('./Builder')
  , _graphInstance = null;


var Graph = function() {
  var connection = null
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
    query = query || null;

    if (query && typeof query === 'string') {
      connection.query(query, parameters, function(err, result) {
        callback(err, result);
      });
    }
  };



  /**
   *
   * @param builder
   * @param cached
   * @param callback
   */
  this.run = function(builder, cached, callback) {
    if (typeof cached === 'function') {
      callback = cached;
      cached = false;
    }

    var me = this
      , query = "";

    if (cached === false) {
      // Concat all queries.
      query = builder.getQuery();
      cachedQuery = query;
    } else {
      query = cachedQuery;
    }

    // Query the database.
    me.Query(query, builder.getParameters(), function(err, result) {
      query = null;
      builder.reset();
      callback(err, result);
    });
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

  return Builder.singleton().reset();
};

module.exports = Graph;
