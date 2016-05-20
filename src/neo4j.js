"use strict";

var _ = require('underscore')
  , async = require('async')
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
  this.execute = function(options) {
    if (!options.success) options.success = function(result) {};
    if (!options.error) options.error = function(err) {console.log(err);};
    // Without a builder it makes no sense to query the database.
    if (!options.builder) options.error({message: 'No Cypher query builder found.', code: 1001}, null);
    // Default settings
    if (_.isUndefined(options.cached) || _.isNull(options.cached)) options.cached = false;
    if (!options.returned || _.isEmpty(options.returned)) options.returned = {};

    var me = this
      , query = "";

    if (options.cached === false) {
      // Concat all queries.
      query = options.builder.getQuery(options.returned);
      cachedQuery = query;
    } else {
      query = cachedQuery;
    }

    /**
     *
     * @param aliases
     * @param result
     * @param callback
     */
    var buildAliases = function(aliases, result, callback) {
      if (!Array.isArray(result) || result.length === 0 || _.isEmpty(aliases)) {
        callback(null, result);
      } else {
        var placeholder = _.keys(aliases);
        // Map over every result item properties to set values to aliases.
        async.mapLimit(
          result,
          1000,
          function iterator(item, immediateCallback) {
            // Loop over the placeholders to be return to replace them with aliases.
            async.eachLimit(
              placeholder,
              100,
              function aliasIterator(placeholder, innerImmediateCallback) {
                if (!_.isUndefined(item[placeholder])) {
                  item[aliases[placeholder]] = item[placeholder];
                  delete item[placeholder];
                }

                innerImmediateCallback(null);
              },
              function eachCallback(err) {
                immediateCallback(err, item);
              });
          },
          function mapCallback(err, aliasResult) {
            callback(err, aliasResult);
          });
      }
    };

    // Query the database.
    me.Query(query, options.builder.getParameters(), function(err, result) {
      query = null;
      options.builder.reset();
      if (err) {
        options.error(err);
      } else {
        buildAliases(options.returned, result, function(err, newResult) {
          if (err) options.error(err);
          else options.success(newResult);
        });
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
