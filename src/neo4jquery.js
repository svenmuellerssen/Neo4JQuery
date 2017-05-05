'use strict'

var _ = require('underscore'),
  async = require('async'),
  Builder = require('./Builder'),
  _graphInstance = null

var Neo4JQuery = function () {
  'use strict'

  var connection = null,
    cachedQuery = ''

  this.Session = null
  this.IsConnected = false
  /**
   * The Cypher builder object.
   */
  this.Builder = null

  /**
   * Set the driver object with the database connection.
   *
   * @param graphConnection {object}
   * @returns {Neo4JQuery}
   */
  this.setConnection = function (graphConnection) {
    'use strict'

    connection = graphConnection
    if (!_.isNull(connection) && !_.isUndefined(connection)) {
      console.log('Connected to database "Neo4J".')
    }

    return this
  }

  this.setConnectionSession = function (graphConnection, session) {
    connection = graphConnection
    this.Session = session

    if (!_.isNull(connection) && !_.isUndefined(connection)) {
      this.IsConnected = true
      console.log('Connected to database "Neo4J".')
    }

    return this
  }

  this.hasConnection = function () {
    return this.IsConnected
  }

  /**
   * Query the database directly with a Cypher query.
   *
   * @param query {string}
   * @param parameters {object}
   * @param callback {function}
   */
  this.Query = function (query, parameters, callback) {
    'use strict'

    query = query || null

    if (query && typeof query === 'string') {
      if (this.Session !== null) {
        this.Session.run(query, parameters).then(function(result) {
          return callback(null, result)
        })
        .catch(function(err) {
          return callback(err)
        })

      } else {
        connection.query(query, parameters, function (err, result) {
          callback(err, result)
        })
      }
    }
  }

  /**
   * Execute a direct stored procedure call.
   *
   * @param domain {string}
   * @param procedureName {string}
   * @param callback {function}
   */
  this.Call = function (domain, procedureName, callback) {
    'use strict'

    domain = domain || null

    // Maybe it is the short usage of the call function.
    if (typeof procedureName === 'function') {
      callback = procedureName
      procedureName = null
    }

    // Domain is required!
    if (_.isNull(domain)) {
      callback({ message: 'No procedure domain given', code: 0 }, null)
    } else {
      // Check if there is a function call at the end of the procedure name
      var lastIndexOf = domain.lastIndexOf('\(\)'),
        procedure = ''

      // No procedure name given, maybe in the domain variable.
      if (_.isNull(procedureName)) {
        // The domain variable has the complete procedure name with function call.
        if (lastIndexOf != -1 && lastIndexOf > 0) { procedure = domain }
      } else {
        // Normal: Procedure name is split into 2 parts.
        procedure = domain + '.' + procedureName
      }

      // Query the stored procedure.
      if (procedure !== '') { connection.query(procedure, {}, callback) } else {
        // The procedure name variable is empty so the procedure name is invalid.
        callback({ message: 'The given domain and procedure name is not a valid stored procedure name.', code: 0 }, null)
      }
    }
  }

  /**
   * Execute the query/ies build with the Cypher builder object.
   * This way is not preferred. Use 'execute' instead with 'options' object.
   *
   * @param builder {Builder}
   * @param cached {boolean}
   * @param callback {function}
   */
  this.run = function (builder, cached, callback) {
    'use strict'

    if (typeof cached === 'function') {
      callback = cached
      cached = false
    }

    var me = this,
      query = ''

    if (cached === false) {
      // Concat all queries.
      query = builder.getQuery()
      cachedQuery = query
    } else {
      query = cachedQuery
    }

    // Query the database.
    me.Query(query, builder.getParameters(), function (err, result) {
      'use strict'

      query = null
      builder.reset()
      callback(err, result)
    })
  }

  /**
   * Execute the query/ies build with the Cypher builder.
   *
   * @param options {object}
   */
  this.execute = function (options) {
    'use strict'

    if (!options.success) options.success = function (result) {}
    if (!options.error) options.error = function (err) { console.log(err) }
    // Without a builder it makes no sense to query the database.
    if (!options.builder) options.error({ message: 'No Cypher query builder found.', code: 1001 }, null)
    // Default settings
    if (_.isUndefined(options.cached) || _.isNull(options.cached)) options.cached = false
    if (!options.aliases || _.isEmpty(options.aliases)) options.aliases = {}

    var me = this,
      query = ''

    if (options.cached === false) {
      // Concat all queries.
      query = options.builder.getQuery(options.aliases)

      cachedQuery = query
    } else {
      query = cachedQuery
    }

    /**
     * Internal function to lead the result items to the preferred aliases.
     *
     * @param aliases {object}
     * @param result {array}
     * @param callback {function}
     */
    var buildAliases = function (aliases, result, callback) {
      'use strict'

      if (!Array.isArray(result) || result.length === 0 || _.isEmpty(aliases)) {
        callback(null, result)
      } else {
        var placeholder = _.keys(aliases)
        // Map over every result item properties to set values to aliases.
        async.mapLimit(
          result,
          1000,
          function iterator (item, immediateCallback) {
            'use strict'

            // Loop over the placeholders to be return to replace them with aliases.
            async.eachLimit(
              placeholder,
              100,
              function aliasIterator (placeholder, innerImmediateCallback) {
                'use strict'

                if (!_.isUndefined(item[placeholder])) {
                  item[aliases[placeholder]] = item[placeholder]
                  delete item[placeholder]
                }

                innerImmediateCallback(null)
              },
              function eachCallback (err) {
                'use strict'

                immediateCallback(err, item)
              })
          },
          function mapCallback (err, aliasResult) {
            'use strict'

            callback(err, aliasResult)
          })
      }
    }

    // Query the database.
    me.Query(query, options.builder.getParameters(), function (err, result) {
      'use strict'

      query = null
      options.builder.reset()
      if (err) {
        options.error(err)
      } else {
        buildAliases(options.returned, result, function (err, newResult) {
          'use strict'

          if (err) options.error(err)
          else options.success(newResult)
        })
      }
    })
  }
}

/**
 * Get the Neo4JQuery object.
 *
 * @param connection {object}
 * @returns {Neo4JQuery}
 */
Neo4JQuery.singleton = function (connection) {
  'use strict'

  connection = connection || null

  if (_.isNull(_graphInstance)) {
    _graphInstance = new Neo4JQuery()
    _graphInstance.Builder = require('./Builder').singleton()
    if (!_.isNull(connection)) _graphInstance.setConnection(connection)
  }

  return _graphInstance
}

module.exports = Neo4JQuery
