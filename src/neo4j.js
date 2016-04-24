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
   * @todo Implement the feature to specify returned nodes and relations!!
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

  /**
   *
   * @param options {Object}
   * @todo Implement the feature to specify returned nodes and relations!!
   */
  this.run2 = function(options) {
    // Without a builder it makes no sense to query the database.
    if (!options.builder) return false;
    // Default settings
    if (!options.success) options.success = function(result) {};
    if (!options.error) options.error = function(err) {};
    if (_.isUndefined(options.cache) || _.isNull(options.cache)) options.cached = false;
    if (!options.returned || !Array.isArray(returned) || returned.length == 0) options.returned = [];

    var me = this
      , query = "";

    if (options.cached === false) {
      // Concat all queries.
      query = options.builder.getQuery(options.returned);
      cachedQuery = query;
    } else {
      query = cachedQuery;
    }

    // Query the database.
    me.Query(query, options.builder.getParameters(), function(err, result) {
      query = null;
      options.builder.reset();
      if (!err) options.success(result);
      else {
        options.error(err);
      }
    });
  };

  this.Builder = function() {
    return Builder.singleton().reset();
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

module.exports = Graph;
